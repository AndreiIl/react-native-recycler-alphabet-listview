import PropTypes from 'prop-types';

const { shape, number, string, oneOf } = PropTypes;

export const IAlphabetListSectionItem = shape({
  data: string,
  index: number
})

export const IAlphabetListItem = shape({
  type: oneOf(['item', 'section']),
  item: oneOf(IAlphabetListSectionItem, PropTypes.object)
});

