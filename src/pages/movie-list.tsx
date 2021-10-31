import React, { useState, useEffect, useContext } from "react";
import {
  List,
  Divider,
  Col,
  Row,
  Checkbox,
  Tag,
  notification,
  Modal,
  Tooltip,
  Spin,
} from "antd";

import InfiniteScroll from "react-infinite-scroll-component";
import { StarTwoTone } from "@ant-design/icons";
import HttpService from "../services/http";
import MovieRating from "../components/MovieRating";
import authContext from "../context/auth";
import styled from "styled-components";
import searchInputContext from "../context/search";
import axios from "axios";
const ourRequest = axios.CancelToken.source();

const RatingWrapper = styled.span`
  &:hover {
    cursor: pointer;
    color: #ffc107;
  }
`;

const SpinWrapper = styled(Spin)`
  display: block;
  margin: 20px auto;
  padding: 30px 50px;
  text-align: center;
`;

export default function MovieListPage(props: any) {
  const { authenticated } = useContext(authContext);

  const { searchQuery, setSearchQuery } = useContext(searchInputContext);
  const [loading, setLoading] = useState<any>(false);
  const [data, setData] = useState<any>([]);

  const [start, setStart] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(50);
  const [totalItems, settotalItems] = useState<number>(0);
  const [end, setEnd] = useState<number>(limit);
  const [isModalVisible, setModalVisible] = useState(props.isModalVisible);

  const [ratingModalData, setRatingModalData] = useState<any>(null);
  const [bulkRating, setBulkRating] = useState<any>(undefined);
  const [bulkRatingIds, setBulkRatingIds] = useState<any>(null);

  const handleCheckBoxBulkRating = (
    data: any,
    dataIndex: number,
    checked: boolean
  ) => {
    const newBulkRating = bulkRating ?? [];
    const newBulkRatingIds = bulkRatingIds ? bulkRatingIds : {};
    if (checked) {
      newBulkRating.push({
        ...data,
        dataIndex: dataIndex,
        user_rating: data.user_rating ?? undefined,
        is_rated: false,
      });
      newBulkRatingIds[data.movie_id] = true;
    } else if (!checked && newBulkRating.length > dataIndex) {
      newBulkRating.splice(dataIndex, 1);
      if (newBulkRatingIds[data.movie_id]) {
        delete newBulkRatingIds[data.movie_id];
      }
    }
    if (newBulkRating.length > 0) {
      props.setEnableBulkRatingButton(true);
    } else {
      props.setEnableBulkRatingButton(false);
      setBulkRating(undefined);
      setBulkRatingIds({});
      return;
    }
    setBulkRatingIds({ ...newBulkRatingIds });
    setBulkRating(newBulkRating);
  };
  const handleBulkRating = (rating: number, index: number) => {
    const newBulkRating = bulkRating;
    if (newBulkRating.length > index) {
      newBulkRating[index].user_rating = rating ?? null;
      newBulkRating[index].is_rated = true;
    }
  };
  const loadMoreData = (
    isInitialLoad: boolean = false,
    start: number = 0,
    limit: number = 50
  ) => {
    if (loading) {
      return;
    }
    setLoading(true);
    HttpService.get(
      authenticated ? "movies/auth/all" : "movies/noauth/all",
      "",
      {
        start: start ?? 0,
        limit: limit,
        query: searchQuery ?? "",
        order: "DESC",
      },
      true
    )
      .then((res: any) => {
        if (isInitialLoad) {
          setData([...res.data]);
        } else {
          setData([...data, ...res.data]);
        }
        setLoading(false);
        settotalItems(res.count);
      })
      .catch((err: any) => {
        setLoading(false);
        notification["error"]({
          message: "Something went wrong",
          description: "Failed to retrieve movies list",
        });
      });
  };

  useEffect(() => {
    setStart(() => 0);
    setLimit(() => 50);
    settotalItems(() => 0);
    setEnd(limit);
    setLoading(false);
    loadMoreData(true, 0, 50);
    debugger;
    return () => {
      ourRequest.cancel();
    };
  }, [searchQuery]);

  useEffect(() => {}, [setBulkRatingIds]);

  const handleRatingModal = (item: any, index: number) => {
    setModalVisible(true);
    setRatingModalData({
      movie: item,
      index: index,
    });
  };
  const onSaveRating = (rating: number) => {
    const { movie, index } = ratingModalData;
    const { id } = movie;
    HttpService.post(`ratings/movie/${id}`, {
      user_rating: rating,
      movie_id: id,
    })
      .then((res: any) => {
        const newData = data;
        if (newData.length > index) {
          newData[index].user_rating = res.data;
        }
        setData(data);
        setModalVisible(false);
        setRatingModalData(null);
        notification["success"]({
          message: "Successfully rated the movie",
        });
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const onSaveBulkRating = () => {
    if (!bulkRating) return;
    const ratings = bulkRating;
    HttpService.post(`ratings/bulk/movies`, {
      ratings: ratings,
    })
      .then((res: any) => {
        const newData = data;
        const length = newData.length;
        res.data?.forEach((item: any) => {
          if (length > item.dataIndex) {
            if (item.movie_id === newData[item.dataIndex].id) {
              newData[item.dataIndex].user_rating = item;
            } else {
              // This is a hack to update the rating of the movie in the list in rare cases where the movie id is not matching
              for (let i = 0; i < length; i++) {
                if (newData[i].id === item.movie_id) {
                  newData[i].user_rating = item;
                  break;
                }
              }
            }
          }
        });

        setData(data);
        setModalVisible(false);
        props.setEnableBulkRatingButton(false);
        props.setModalVisible(false);
        setBulkRating(undefined);
        const ids = {};
        setBulkRatingIds({ ...ids });
        notification["success"]({
          message: "Successfully rated the movies",
        });
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handleOk = () => {
    onSaveBulkRating();
    setModalVisible(false);
    setRatingModalData(null);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setRatingModalData(null);
  };
  const resetValues = () => {
    setStart(0);
    setLimit(50);
    settotalItems(0);
    setEnd(limit);
    setLoading(false);
    setData([]);
  };
  useEffect(() => {
    if (props.isModalVisible) setModalVisible(true);
  }, [props.isModalVisible]);
  return (
    <div>
      <InfiniteScroll
        dataLength={data?.length}
        next={() => {
            debugger;
          setStart(end + 1);
          setEnd(end + limit);
          loadMoreData(false, end + 1, limit);
        }}
        hasMore={data.length < totalItems}
        loader={<SpinWrapper size="large" />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          key={data?.length}
          grid={{ gutter: 32, xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
          style={{
            width: "70%",
            margin: "0 auto",
            textAlign: "center",
          }}
          dataSource={data ? data : []}
          renderItem={(item: any, index: number) => (
            <List.Item
              key={item.id}
              style={{
                margin: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                minHeight: "100px",
                width: "100%",
                textAlign: "left",
              }}
            >
              <Row gutter={[16, 16]} align="middle">
                <Col span={2}>
                  <div
                    style={{ textAlign: "right" }}
                    data-id={item.id}
                    data-checked={
                      bulkRatingIds ? bulkRatingIds[item.id] : false
                    }
                  >
                    <Checkbox
                      checked={
                        bulkRatingIds && bulkRatingIds[item.id] ? true : false
                      }
                      onChange={(e) => {
                        handleCheckBoxBulkRating(
                          {
                            title: item.title,
                            movie_id: item.id,
                            user_rating: item.user_rating?.user_rating,
                            user_rating_id: item.user_rating?.id,
                          },
                          index,
                          e.target.checked
                        );
                      }}
                    />
                  </div>
                </Col>
                <Col span={4}>
                  {/* <Avatar shape="square" size={80}  /> */}
                  <img
                    width={80}
                    height={80}
                    loading="lazy"
                    src={item.poster}
                  />
                </Col>
                <Col span={13}>
                  <h4>
                    {item.title}&nbsp;({item.release_year}),
                    {item.crew?.map((crewItem: any) => (
                      <span key={crewItem?.id}>{`${crewItem?.name}${
                        crewItem?.role === "director" ? "(dir)" : ""
                      }`}</span>
                    ))}
                  </h4>
                  <p>
                    {item.genres?.map((genreItem: any) => (
                      <Tag color="red" key={genreItem?.id}>
                        {genreItem?.name}
                      </Tag>
                    ))}
                    {/* <Tag color="volcano">volcano</Tag>
                  <Tag color="orange">orange</Tag>
                  <Tag color="gold">gold</Tag> */}
                  </p>
                </Col>
                <Col span={2}>
                  <div>
                    <StarTwoTone twoToneColor="#F0CA71" /> &nbsp;
                    {item?.average_rating}
                  </div>
                </Col>
                <Col span={3}>
                  <div>
                    &nbsp;
                    {!item?.user_rating && (
                      <Tooltip
                        title={
                          !authenticated
                            ? "Please login to rate this movie"
                            : "Click the text to rate this movie"
                        }
                      >
                        {
                          <RatingWrapper
                            onClick={() => {
                              if (authenticated) {
                                handleRatingModal(item, index);
                              }
                            }}
                          >
                            <StarTwoTone />
                            Rate
                          </RatingWrapper>
                        }
                      </Tooltip>
                    )}
                    {item?.user_rating && (
                      <>
                        <StarTwoTone />
                        &nbsp;{item?.user_rating?.user_rating * 2}
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </InfiniteScroll>
      <Modal
        title="Rate This Movies"
        visible={isModalVisible}
        // footer={!props.enableBulkRatingButton && null}
        closable
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {!props.enableBulkRatingButton && (
          <MovieRating
            rating={ratingModalData?.movie?.user_rating?.user_rating ?? null}
            movieTitle={ratingModalData?.movie?.title}
            onSaveRating={onSaveRating}
          />
        )}
        {props.enableBulkRatingButton &&
          bulkRating?.map((item: any, ratingIndex: number) => (
            <MovieRating
              key={item.movie_id}
              movieTitle={item.title}
              rating={item.user_rating}
              onSaveRating={(rating: number) => {
                handleBulkRating(rating, ratingIndex);
              }}
            />
          ))}
      </Modal>
    </div>
  );
}
