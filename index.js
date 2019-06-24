import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { LayoutProvider } from 'recyclerlistview';
import DataProvider from 'recyclerlistview/dist/reactnative/core/dependencies/DataProvider';
import RecyclerListView from 'recyclerlistview/dist/reactnative/core/RecyclerListView';
import { IAlphabetListItem } from './types/index'

// TODO: move to props
const indexComponentWidth = 30;
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


class AlphabetizedRecyclerList extends Component {
  dataProvider
  layoutProvider

  // TODO: maybe add a recyclerListViewProps & a flatListProps as prop-types
  static propTypes = {
    items: PropTypes.arrayOf(IAlphabetListItem),
    sectionItems: PropTypes.arrayOf(IAlphabetListItem),
    onCellSelect: PropTypes.func,
    cellComponent: PropTypes.elementType,
    sectionComponent: PropTypes.elementType,
    indexComponent: PropTypes.elementType,
    cellProps: PropTypes.object,
    indexHeight: PropTypes.number,
    cellHeight: PropTypes.number,
    sectionHeight: PropTypes.number,
  }

  constructor(props) {
    super(props);

    this.recyclerListView = React.createRef()

    this.dataProvider = new DataProvider((r1, r2) => {
      return r1.type !== r2.type || r1.id !== r2.id;
    });
  }

  componentWillMount() {
    this.updateProviders(this.props)
  }

  componentWillReceiveProps(newProps) {
    this.updateProviders(newProps)
  }

  updateProviders = (props) => {
    const { items = [], cellHeight, sectionHeight } = props;
    if (items.length > 0) {
      this.layoutProvider = new LayoutProvider(
        index => items[index].type,
        (type, dim) => {
          switch (type) {
            case 'section':
              dim.width = viewportWidth;
              dim.height = sectionHeight;
              break;
            case 'item':
              dim.width = viewportWidth;
              dim.height = cellHeight;
              break;
            default:
              dim.width = viewportWidth;
              dim.height = cellHeight;
              break;
          }
        },
      );

      this.dataProvider = this.dataProvider.cloneWithRows(items);
    }
  }

  rowRenderer = (type, el) => {
    switch (type) {
      case 'section':
        const SectionComponent = this.props.sectionComponent;
        return <SectionComponent data={el.item.data} />;
      case 'item':
        const CellComponent = this.props.cellComponent;
        const props = {
          item: el.item,
          onSelect: this.props.onCellSelect,
        };
        return <CellComponent {...this.props.cellProps} {...props} />;
      default:
        // TODO: throw an error if anything else
        return null;
    }
  }

  renderIndexComponent = el => {
    // TODO: set some default values
    const {data, index} = el.item;
    const IndexComponent = this.props.indexComponent;

    return (
      <IndexComponent onPress={this.scrollToIndex} data={data} index={index} />
    );
  }

  scrollToIndex = index => {
    this.recyclerListView.current.scrollToIndex(index, true);
  }

  render() {
    const { sectionItems, indexHeight } = this.props;
    const numberOfLetters = sectionItems.length;

    if(!numberOfLetters) {
      // TODO: maybe throw some error or a default message
      return null
    }

    return (
      <View
        style={[
          { height: numberOfLetters * indexHeight },
          styles.container
        ]}>
        <RecyclerListView
          ref={this.recyclerListView}
          nestedScrollEnabled={true}
          style={{ flex: 1 }}
          layoutProvider={this.layoutProvider}
          dataProvider={this.dataProvider}
          rowRenderer={this.rowRenderer}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.indexContainer}>
          <FlatList
            renderItem={this.renderIndexComponent}
            nestedScrollEnabled={true}
            data={sectionItems}
            keyExtractor={(it, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            />
        </View>
      </View>
    )
  }
}

export default AlphabetizedRecyclerList;

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
    maxHeight: viewportHeight * 0.9,
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  indexContainer: {
    width: indexComponentWidth,
  },
});
