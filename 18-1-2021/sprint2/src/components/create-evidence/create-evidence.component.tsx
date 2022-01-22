import React, { ReactElement, useRef, useState,useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import { replaceBase64ToUrl } from '../../utils/get-images.util';
import { useDispatch } from 'react-redux';
import { createEvidence } from '../../store/actions/cases.actions';
import IframeWrapper from '../iframe-wrapper/iframe-wrapper.component';
import WindowPortal from '../new-window/window-portal.component';
import config from './../../config.json';

export interface CreateEvidenceProps {
  show?: boolean;
  handleClose?: any;
}

function CreateEvidence(props: CreateEvidenceProps): ReactElement {
  const { show, handleClose } = props;
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const [showLibrary, setshowLibrary] = useState(show);
  const [selectedElement, setSelectedElement] = useState({ location:'', reference:''});
  const [evidence, setEvidence] = useState({
    isRedacted: false,
    pinSite: false,
    libraryId: '',
    refrence: '',
  });
  const resetState = () => {
    setEvidence({
      isRedacted: false,
      pinSite: false,
      libraryId: '',
      refrence: '',
    });
    setshowLibrary(false);
  };
  const onClose = () => {
    resetState();
    handleClose();
  };
  const onSubmit = async () => {
    if (editorRef.current) {
      let evi: any = evidence;
      const url = await replaceBase64ToUrl((editorRef.current as any).getContent());
      evi = { ...evi, ...url, type: 'INFRINGEMENTS' };
      dispatch(createEvidence(evi));
      resetState();
      handleClose();
    }
  };

  const getUpdatedSelectedData = () =>{
    if(localStorage.getItem('selectedData') !== null){
     const seletedData = JSON.parse(localStorage.getItem('selectedData') || '');
     if(seletedData.title){
        evidence.libraryId = seletedData.item;
        evidence.refrence = seletedData.title;
       const temp = { location:seletedData.path, reference:seletedData.title };
      setSelectedElement(temp);
     }
    }
    return true;
  }
  useEffect(()=>{
    window.addEventListener('storage',(event)=>{
      getUpdatedSelectedData();
    })
  });
  return (
    <>
      <Modal show={show} onHide={onClose} fullscreen="lg-down" size="lg" enforceFocus={false} backdrop="static">
        {/* <Resizable> */}
        <Modal.Header closeButton>
          <Modal.Title>Add Evidence</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ pointerEvents: 'all' }}>
          <div style={{ minHeight: '60vh', height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="Redacted"
                    checked={evidence.isRedacted}
                    onChange={() => setEvidence({ ...evidence, isRedacted: !evidence.isRedacted })}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="Pin Site"
                    checked={evidence.pinSite}
                    onChange={() => setEvidence({ ...evidence, pinSite: !evidence.pinSite })}
                  />
                </Form.Group>
              </div>
              <span
                style={{ textAlign: 'right', color: 'var(--blue-100)', cursor: 'pointer' }}
                onClick={(e) =>{  
                                e.preventDefault();
                                setshowLibrary((prev) => !prev);
                                window.open( `http://localhost:3000/library/library-detach`,"_blank","height=570,width=520,scrollbars=no,status=no")
                              }}
              >
                {/* {showLibrary ? 'Close' : 'Open'} Library */}  Open Library
              </span>
            </div>
            <input id="my-file" type="file" name="my-file" style={{ display: 'none' }} />
            <div style={{ flex: 1 }}>
              <Editor
                apiKey={config.timymce_api}
                onInit={(evt, editor) => ((editorRef as any).current = editor)}
                init={{
                  min_height: 400,
                  // height: '100%',
                  menubar: false,
                  file_picker_types: 'image',
                  statusbar: false,
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
            <Form style={{ flexDirection: 'row', gap: 20, display: 'flex' }}>
              <Form.Group className="mb-3" style={{ flex: 1 }}>
                <Form.Label htmlFor="reference-url">Library Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Library Location"
                  aria-label="Library Location"
                  name="reference-url"
                  style={{ height: 40 }}
                  value={evidence.libraryId}
                  onChange={(ev) => setEvidence({ ...evidence, libraryId: ev.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3" style={{ flex: 1 }}>
                <Form.Label htmlFor="reference-url">Library Reference</Form.Label>
                <Form.Control
                  type="text"
                  // readOnly
                  placeholder="Select Library Reference"
                  aria-label="Library Reference"
                  name="reference-url"
                  style={{ height: 40 }}
                  value={evidence.refrence}
                  onChange={(ev) => setEvidence({ ...evidence, refrence: ev.target.value })}
                />
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* {showLibrary ? (
         window.open( `http://localhost:3000/library/library-detach`,"_blank","height=570,width=520,scrollbars=no,status=no")
        // <WindowPortal width={520} height={570} scrollbars={'no'} closeWindowPortal={() => setshowLibrary(false)}>
        //   <IframeWrapper  src="http://localhost:3000/library/library-detach" />
        // </WindowPortal>
      ) : (
        <></>
      )} */}
    </>
  );
}

export default CreateEvidence;
