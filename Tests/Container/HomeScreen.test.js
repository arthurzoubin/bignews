import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import {
  HomeScreen,
  STATIC_TEXT,
  mapStateToProps,
  mapDispatchToProps,
} from '../../App/Containers/HomeScreen';

const props = {
  newsListResults: {
    totalResults: 13,
    articles: [
      {
        title: 'title1',
        urlToImage: 'image1',
      },
      {
        title: 'title2',
        urlToImage: 'image2',
      },
      {
        title: 'title3',
        urlToImage: 'image3',
      }],
  },
  newsListFetching: false,
  newsListError: null,
  sourceListResults: [
    {
      id: 'id1',
      name: 'name1',
    },
    {
      id: 'id2',
      name: 'name2',
    },
    {
      id: 'id3',
      name: 'name3',
    },
  ],
  sourceListFetching: false,
  sourceListError: null,
  loadNewsList: jest.fn(),
  loadNewsAgency: jest.fn(),
  clearStore: jest.fn(),
};


jest.mock('native-base', () => {
  const NativeBase = require.requireActual('native-base');
  const callBack = jest.fn();
  NativeBase.ActionSheet = {
    show: () => callBack,
  };
  return NativeBase;
});

const NativeBase = require('native-base');

describe('HomeScreen render', () => {
  test('should render a flat list, a input and a filter', () => {
    const wrapper = shallow(<HomeScreen {...props} />);
    expect(wrapper.dive().find('FlatList')).toHaveLength(1);
    expect(wrapper.find('Styled(Input)')).toHaveLength(1);
    expect(wrapper.find({ name: 'filter' })).toHaveLength(1);
  });

  test('should render items in flat list', () => {
    const item = {
      urlToImage: 'Image',
      title: 'title',
    };
    const wrapper = shallow(<HomeScreen {...props} />);
    const flatListProps = wrapper.dive().find('FlatList').props();

    expect(shallow(flatListProps.renderItem({ item })).find('Text').children().text()).toBe(item.title);
    expect(shallow(flatListProps.renderItem({ item })).find('Image').props().source).toEqual({ uri: item.urlToImage });
  });
});

describe('flat list actions', () => {
  test('should display an end sign at the bottom of the list ', () => {
    const wrapper = shallow(<HomeScreen {...props} />);
    const newWrapper = wrapper.setState({ isNewsEnd: true });
    const flatListProps = newWrapper.dive().find('FlatList').props();

    expect(flatListProps.ListFooterComponent().props.children).toBe(STATIC_TEXT.endOfList);
  });
  test('should display a spinner, when loading news list ', () => {
    const wrapper = shallow(<HomeScreen {...props} />);
    wrapper.setProps({ newsListFetching: true });
    wrapper.update();
    const flatListProps = wrapper.dive().find('FlatList').props();

    expect(shallow(flatListProps.ListFooterComponent()).find('Spinner')).toHaveLength(1);
  });
  test('should call the loadNewsList action to load a new page when reached the end of the list.', () => {
    const wrapper = shallow(<HomeScreen {...props} />);
    wrapper.setProps({ newsListFetching: false });
    wrapper.update();
    const flatListProps = wrapper.dive().find('FlatList').props();
    flatListProps.onEndReached();

    expect(props.loadNewsList).toBeCalled();
  });

  test('should set isNewsEnd be true in state, when the items in list was equal to total size ', () => {
    const propsWithParams = {
      newsListResults: { totalResults: 3 },
      clearStore: jest.fn(),
    };
    const wrapper = shallow(<HomeScreen {...props} />);
    const newWrapper = wrapper.setState({ newsList: [1, 2, 3] });

    newWrapper.instance().addMoreNewsListToState(propsWithParams);
    expect(newWrapper.state().isNewsEnd).toBe(true);
  });
});

describe('the input action for search box.', () => {
  const wrapper = shallow(<HomeScreen {...props} />);
  const inputProps = wrapper.dive().find('Styled(Input)').props();

  const event = {
    nativeEvent: {
      text: 'value',
    },
  };

  test('should change the searchKeyword value in state, when typing text in input.', () => {
    inputProps.onChangeText('text');
    expect(wrapper.state('searchKeyword')).toEqual('text');
  });

  test('should call the loadNewsList function when submitted the text. ', () => {
    inputProps.onSubmitEditing(event);
    expect(props.loadNewsList).toBeCalled();
  });
});


describe('the filter button actions', () => {
  const spy = jest.spyOn(NativeBase.ActionSheet, 'show');
  const sourceList = ['name1', 'name2', 'name3'];

  test('should call the ActionSheet function when pressed the button ', () => {
    const wrapper = shallow(<HomeScreen {...props} />);
    const newWrapper = wrapper.setState({ sourceList });
    const filterButtonProps = newWrapper.dive().find('Styled(Button)').props();
    filterButtonProps.onPress();
    expect(spy).toBeCalled();
  });

  test('should change the state and the redux action should be called, when the item in action sheet pressed.', () => {
    const wrapper = shallow(<HomeScreen {...props} />);
    const newWrapper = wrapper.setState({ sourceList });
    newWrapper.instance().handleActionSheetSelected(1);
    expect(props.loadNewsList).toBeCalled();
  });
});

describe('mapStateToProps and mapDispatchToProps', () => {
  test('should return the states, when the mapStateToProps action called', () => {
    const state = {
      newsList: {
        newsListResults: null,
        newsListFetching: null,
        newsListError: null,
        sourceListResults: null,
        sourceListFetching: null,
        sourceListError: null,
      },
    };

    expect(mapStateToProps(state)).toEqual({
      newsListResults: null,
      newsListFetching: null,
      newsListError: null,
      sourceListResults: null,
      sourceListFetching: null,
      sourceListError: null,
    });
  });

  test('should call the dispatch function  when the mapDispatchToProps actions called', () => {
    const payload = true;
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).loadNewsList(payload);
    expect(dispatch).toHaveBeenCalledTimes(1);
    mapDispatchToProps(dispatch).loadNewsAgency();
    expect(dispatch).toHaveBeenCalledTimes(2);
    mapDispatchToProps(dispatch).clearStore();
    expect(dispatch).toHaveBeenCalledTimes(3);
  });
});
