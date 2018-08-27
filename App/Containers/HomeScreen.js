import React, { Component } from 'react';
import {
  Text, View, FlatList, Image,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container,
  Header,
  Button,
  Icon,
  Input,
  Content,
  Spinner,
  ActionSheet,
  Item,
} from 'native-base';

import NewsListActions from '../Redux/NewsListRedux';
import styles from './Styles/HomeScreenStyles';

export const STATIC_TEXT = {
  actionSheetTitle: 'Change news agency',
  searchPlaceHolder: 'Search',
  endOfList: 'The End',
  emptyOfList: 'no news',
};

const FLATTLIST_THRESHHOLD_TIME = 0.1;
const PER_PAGE_SIZE = 15;
const PAGE_STEP = 1;
const FIRST_PAGE_NUM = 1;
const NUM_COLUMNS = 2;

const renderNewsListItem = ({ item }) => (
  <View style={{ flex: 1 }}>
    <Image source={{ uri: item.urlToImage }} style={styles.flatListImage} />
    <Text>{item.title}</Text>
  </View>
);
renderNewsListItem.propTypes = {
  item: PropTypes.shape.isRequired,
};

export class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceList: null,
      newsList: [],
      searchKeyword: '',
      searchParams: null,
      isNewsEnd: false,
    };
    this.handleActionSheetSelected = this.handleActionSheetSelected.bind(this);
    this.addMoreNewsListToState = this.addMoreNewsListToState.bind(this);
    this.handleFilterButtonClick = this.handleFilterButtonClick.bind(this);
  }

  componentDidMount() {
    const { loadNewsAgency, loadNewsList } = this.props;
    const payload = {
      country: 'us',
      pageSize: PER_PAGE_SIZE,
      page: FIRST_PAGE_NUM,
    };
    this.setState({ searchParams: payload });
    loadNewsList(payload);
    loadNewsAgency();
  }

  componentWillReceiveProps(nextProps) {
    this.addSourceToAction(nextProps);
    this.addMoreNewsListToState(nextProps);
  }

  addSourceToAction(props) {
    const { sourceListResults } = props;
    const { sourceList } = this.state;
    if (!sourceList && sourceListResults) {
      const list = [];
      sourceListResults.map(item => list.push(item.name));
      this.setState({ sourceList: list });
    }
  }

  addMoreNewsListToState(nextProps) {
    const { newsListResults, clearStore } = nextProps;
    const { newsList } = this.state;
    const result = newsList;
    if (newsListResults && newsListResults.totalResults > 0) {
      if (newsListResults.totalResults === result.length) {
        this.setState({ isNewsEnd: true });
      } else {
        this.setState({ newsList: result.concat(newsListResults.articles) });
      }
      clearStore({ newsListResults: null });
    }
  }

  handleActionSheetSelected(index) {
    const { sourceList } = this.state;
    const { sourceListResults, loadNewsList } = this.props;
    let clickedItem = null;
    if (index) {
      const sourceName = sourceList[index];
      clickedItem = sourceListResults.find(item => item.name === sourceName);
    }
    if (clickedItem) {
      this.setState({ newsList: [], isNewsEnd: false });
      const payload = {
        sources: clickedItem.id,
        pageSize: PER_PAGE_SIZE,
        page: FIRST_PAGE_NUM,
      };
      this.setState({
        searchParams: payload,
      });
      loadNewsList(payload);
      this.setState({ searchKeyword: '' });
    }
  }

  handleFilterButtonClick() {
    const { sourceList } = this.state;
    return sourceList && ActionSheet.show(
      {
        options: sourceList,
        title: STATIC_TEXT.actionSheetTitle,
      },
      buttonIndex => this.handleActionSheetSelected(buttonIndex),
    );
  }

  handleSearchTextChange(value) {
    this.setState({ searchKeyword: value });
  }

  handleSearchSubmit(value) {
    const { loadNewsList } = this.props;
    if (value) {
      this.setState({ newsList: [], isNewsEnd: false });
      const payload = {
        q: value,
        pageSize: PER_PAGE_SIZE,
        page: FIRST_PAGE_NUM,
      };
      this.setState({
        searchParams: payload,
      });
      loadNewsList(payload);
    }
  }

  handleOnEndNewsList() {
    const { searchParams, isNewsEnd } = this.state;
    const { newsListFetching, loadNewsList } = this.props;
    if (!isNewsEnd && !newsListFetching) {
      const payload = {
        ...searchParams,
        page: searchParams.page + PAGE_STEP,
      };
      this.setState({
        searchParams: payload,
      });
      loadNewsList(payload);
    }
  }

  renderListFooter() {
    const { isNewsEnd } = this.state;
    const { newsListFetching } = this.props;

    if (isNewsEnd) {
      return <Text>{STATIC_TEXT.endOfList}</Text>;
    }
    return newsListFetching && <Spinner color="green" />;
  }

  render() {
    const { sourceListFetching, sourceListError, newsListFetching } = this.props;
    const { newsList, searchKeyword } = this.state;

    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder={STATIC_TEXT.searchPlaceHolder}
              value={searchKeyword}
              onChangeText={text => this.handleSearchTextChange(text)}
              onSubmitEditing={e => this.handleSearchSubmit(e.nativeEvent.text)}
            />
            {(!sourceListFetching && !sourceListError) && (
              <Button onPress={this.handleFilterButtonClick}>
                <Icon type="MaterialCommunityIcons" name="filter" />
              </Button>
            )}
          </Item>
        </Header>
        <Content
          padder
          style={styles.contentLayout}
          contentContainerStyle={styles.contentContainer}
        >
          <View>
            {newsList && (
              <FlatList
                data={newsList}
                numColumns={NUM_COLUMNS}
                renderItem={renderNewsListItem}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={() => this.renderListFooter()}
                onEndReached={() => this.handleOnEndNewsList()}
                ListEmptyComponent={!newsListFetching && <Text>{STATIC_TEXT.emptyOfList}</Text>}
                onEndReachedThreshold={FLATTLIST_THRESHHOLD_TIME}
              />
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

HomeScreen.propTypes = {
  sourceListResults: PropTypes.arrayOf(PropTypes.object),
  newsListFetching: PropTypes.bool.isRequired,
  sourceListFetching: PropTypes.bool.isRequired,
  loadNewsList: PropTypes.func.isRequired,
  loadNewsAgency: PropTypes.func.isRequired,
  sourceListError: PropTypes.bool,
};

HomeScreen.defaultProps = {
  sourceListError: false,
  sourceListResults: [],
};

export const mapStateToProps = state => ({
  newsListResults: state.newsList.newsListResults,
  newsListFetching: state.newsList.newsListFetching,
  newsListError: state.newsList.newsListError,
  sourceListResults: state.newsList.sourceListResults,
  sourceListFetching: state.newsList.sourceListFetching,
  sourceListError: state.newsList.sourceListError,
});

export const mapDispatchToProps = dispatch => ({
  loadNewsList: payload => dispatch(NewsListActions.newsListRequest(payload)),
  loadNewsAgency: () => dispatch(NewsListActions.sourceListRequest()),
  clearStore: payload => dispatch(NewsListActions.clearStore(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeScreen);
