import {
  Modal as AriaModal,
  Dialog as AriaDialog,
} from 'react-aria-components';

const Modal = () => {
  return (
    <AriaModal isDismissable>
      <AriaDialog>
        {({ close }) => (
          <>
            <p>hello</p>
            <button onPress={close}>Submit</button>
          </>
        )}
      </AriaDialog>
    </AriaModal>
  );
};

export default Modal;
