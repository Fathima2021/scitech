import React, { ReactElement, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from './edit-evidence.module.css';
import { Editor } from '@tinymce/tinymce-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { IEvidence } from '../../store/store.interface';
import WindowPortal from '../new-window/window-portal.component';
import IframeWrapper from '../iframe-wrapper/iframe-wrapper.component';
import config from './../../config.json';

export interface EditEvidenceProps {
  evidence: IEvidence;
  show: boolean;
  onClose: any;
  onChange: any;
  toggleLibrary?: any;
}

const EditEvidence = (props: EditEvidenceProps): ReactElement => {
  const { evidence, show, onClose, toggleLibrary } = props;
  const [evidenceData, setEvidenceData] = useState({ ...evidence });
  const [showLibrary, setshowLibrary] = useState(show);
  const editorRef = useRef(null);
  return (
    <>
      <Modal show={show} onHide={onClose} fullscreen="lg-down" size="lg" enforceFocus={false} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Edit Evidence</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, gap: 10 }}>
            <p style={{ margin: 0 }}>Used in X instances</p>
            <Form.Check type="radio" label="Apply edits to all instances" name="shouldEdit" />
            <Form.Check type="radio" label="Make Unique" name="shouldEdit" />
          </div>
          <div style={{ flex: 1 }}>
            <Editor
              apiKey={config.timymce_api}
              initialValue={evidence.Evidence}
              onInit={(evt, editor) => ((editorRef as any).current = editor)}
              init={{
                min_height: 200,
                // height: '100%',
                menubar: false,
                statusbar: false,
                file_picker_types: 'image',
                file_picker_callback: function (callback, value, meta) {
                  if (meta.filetype == 'image') {
                    const input: any = document.getElementById('my-file');
                    input.click();
                    input.onchange = function () {
                      const file = input.files[0];
                      const reader = new FileReader();
                      reader.onload = function (e: any) {
                        callback(e.target.result, {
                          alt: file.name,
                        });
                      };
                      reader.readAsDataURL(file);
                      input.value = '';
                    };
                  }
                },
                paste_data_images: true,
                image_title: true,
                automatic_uploads: true,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount',
                ],
                toolbar:
                  'undo redo | fontselect | fontsizeselect  | ' +
                  'bold italic backcolor forecolor | link image | code | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="See also"
                checked={evidenceData.PinCite}
                onChange={() => setEvidenceData({ ...evidenceData, PinCite: !evidenceData.PinCite })}
              />
            </Form.Group>
            <p>
              <button
                style={{ outline: 'none', border: '.5px solid var(--grey-50)', marginRight: 5 }}
                onClick={() => setshowLibrary(!showLibrary)}
              >
                <FontAwesomeIcon icon={faLink} />
              </button>
              <span>Col 34</span>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {showLibrary ? (
        <WindowPortal closeWindowPortal={() => setshowLibrary(false)}>
          <IframeWrapper src="http://localhost:3000/" />
        </WindowPortal>
      ) : (
        <></>
      )}
    </>
  );
};

export default EditEvidence;
