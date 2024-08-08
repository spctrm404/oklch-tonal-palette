import { useCallback, useContext } from 'react';
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Popover as AriaPopover,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
} from 'react-aria-components';
import IconButton from '../IconButton/IconButton';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Select.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Select = ({
  items = null,
  selectedKey = '',
  onSelectionChange = () => {},
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  const onSelectionChangeHandler = useCallback(
    (a) => {
      onSelectionChange?.(a);
    },
    [onSelectionChange]
  );

  return (
    <AriaSelect
      selectedKey={selectedKey}
      onSelectionChange={onSelectionChangeHandler}
      data-theme={theme}
      {...props}
    >
      <IconButton>
        <AriaSelectValue />
      </IconButton>
      <AriaPopover>
        <AriaListBox>
          {items.map((anItem) => {
            return (
              <AriaListBoxItem key={anItem.uid} uid={anItem.uid}>
                {anItem.text}
              </AriaListBoxItem>
            );
          })}
        </AriaListBox>
      </AriaPopover>
    </AriaSelect>
  );
};

export default Select;
