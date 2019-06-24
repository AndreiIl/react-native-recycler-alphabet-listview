# react-native-recycler-alphabet-listview
High performance React-Native alphabet list view inspired by [react-native-alphabetlistview](https://github.com/i6mi6/react-native-alphabetlistview), based on RecyclerListView component.

Soon to be available on npm:   
```
npm install --save @tremend/react-native-recycler-alphabet-listview
```
## Usage

```javascript
import React, {Component} from 'react';
import {View} from 'react-native';
import {Subscription} from 'rxjs';
import AlphabetizedSectionList from '../../components/AlphabetizedSectionList';
import ArtistsService from '../../services/artists.service';
import {getAlphabetizedData} from '../../utils/alphabet.utils';

class AlphabetExample extends Component {
  artistsSubscription: Subscription;

  constructor(props, state) {
    super(props, state);
    this.artistsSubscription = new Subscription();
    this.state = {
      alphabetizedArtists: [],
      artistsSections: [],
    };
  }

  componentDidMount() {
    this.artistsSubscription = ArtistsService.getArtists().subscribe(data => {
      if (data.length > 0) {
        const {
          alphabetizedData: alphabetizedArtists = [],
          sections: artistsSections = [],
        } = getAlphabetizedData(data, 'lastname');

        this.setState({
          alphabetizedArtists,
          artistsSections
        });
      }
    });
  }

  componentWillUnmount() {
    this.artistsSubscription.unsubscribe();
  }
  
  onCellSelect = (id) => {
    // do smth on cell tap
  }

  render() {
    const {alphabetizedArtists = [], artistsSections = []} = this.state;

    return (
        <AlphabetizedSectionList
          items={alphabetizedArtists}
          sectionItems={artistsSections}
          cellComponent={ArtistListCell}
          onCellSelect={this.onCellSelect}
          cellHeight={16}
          sectionHeight={26}
          indexHeight={18}
          indexComponent={GeneralSectionItem}
          sectionComponent={ArtistSectionHeader}
        />
    );
  }
}

export default AlphabetExample;

```
