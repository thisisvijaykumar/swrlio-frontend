import React, { useState, useEffect, useContext } from "react";
import {
  List,
  message,
  Avatar,
  Skeleton,
  Divider,
  Col,
  Row,
  Checkbox,
  Tag,
  Typography,
  notification,
  Button,
  Modal,
  Tooltip,
  Tabs,
} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { StarTwoTone, StarFilled, StarOutlined } from "@ant-design/icons";
import { useLocation, useParams } from "react-router-dom";
import HttpService from "../services/http";
import MovieRating from "../components/MovieRating";
import authContext from "../context/auth";
import styled from "styled-components";
import MovieListPage from "./movie-list";
import UserRatedMovies from "./user-rated-movies";
// import SearchInputContext from "../context/search";

const { TabPane } = Tabs;

export default function HomePage() {
  const { authenticated } = useContext(authContext);
  const [enableBulkRatingButton, setEnableBulkRatingButton] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const onBulkRating = () => {
    debugger;
    setModalVisible(true);
  };

  return (
    <div>
      <Tabs
        id="scrollableDiv"
        style={{
          overflow: "auto",
          // background:"inherit"
        }}
        tabBarExtraContent={
          <Button
            disabled={!authenticated || !enableBulkRatingButton}
            onClick={() => onBulkRating()}
          >
            Rate
          </Button>
        }
      >
        <TabPane tab="All Movies" key="1">
         
            <MovieListPage
              setEnableBulkRatingButton={setEnableBulkRatingButton}
              enableBulkRatingButton={enableBulkRatingButton}
              setModalVisible={setModalVisible}
              isModalVisible={isModalVisible}
            />
          
        </TabPane>
        <TabPane tab="My Rated Movies" key="2" disabled={!authenticated}>
          <UserRatedMovies />
        </TabPane>
      </Tabs>
    </div>
  );
}
