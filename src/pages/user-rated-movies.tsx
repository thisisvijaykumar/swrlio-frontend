import { Col, List, notification, Row, Tag } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { StarTwoTone } from "@ant-design/icons";
import HttpService from "../services/http";
import searchInputContext from "../context/search";

export default function UserRatedMovies() {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const { searchQuery, setSearchQuery } = useContext(searchInputContext);

  const loadData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    HttpService.get(
      "movies/auth/rated-list",
      "",
      {
        query: searchQuery ?? "",
        order: "DESC",
      },
      true
    )
      .then((res: any) => {
        setData([...res.data]);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        notification["error"]({
          message: "Something went wrong",
          description: "Failed to retrieve rated movies list",
        });
      });
  };
  useEffect(() => {
      loadData();
      return () => {
          setData([]);
      }
  }, [])
  return (
    <div>
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
              <Col span={4}>
                <img width={80} height={80} loading="lazy" src={item.poster} />
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
                  <StarTwoTone />
                  &nbsp;{item?.user_rating?.user_rating * 2}
                </div>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </div>
  );
}
