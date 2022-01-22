import { Editor } from '@tinymce/tinymce-react';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPatents } from '../../store/actions/claims.actions';
import { EventsEnum } from '../../store/events';
import { IPatent } from '../../store/store.interface';
import styles from './home.module.css';
import config from './../../config.json';

const HomeScreen = (): JSX.Element => {
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { caseInfo, patents } = useSelector((state) => (state as any).claims);
  useEffect(() => {
    dispatch(fetchPatents());
  }, [caseInfo?.CaseId]);
  const onPatentSelected = (patent: IPatent): void => {
    dispatch({ type: EventsEnum.UPDATE_SELECTED_PATENT, data: { patentId: patent.PatentId } });
  };

  return (
    <div className={styles.home_screen}>
      <div className={styles.left_section}>
        <Editor
          apiKey={config.timymce_api}
          onInit={(evt, editor) => ((editorRef as any).current = editor)}
          init={{
            // min_height: 400,
            height: 'calc(100vh - 120px)',
            menubar: false,
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
            statusbar: false,
            toolbar:
              'undo redo | formatselect | ' +
              'bold italic backcolor forecolor | link image | code | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        />
      </div>
      <div className={styles.right_section}>
        <div className={styles.case_patent_container}>
          <div className={styles.case_details}>
            <h4 className={styles.case_txt}>{caseInfo?.CaseName || 'NA'}</h4>
            <p className={styles.case_txt}>Judge {caseInfo?.Judge || 'NA'}</p>
            <p className={styles.case_txt}>{caseInfo?.District || 'NA'}</p>
          </div>
          <ul className={styles.patent_list}>
            {(patents || []).map((patent: IPatent) => {
              return (
                <li
                  key={patent.PatentNumber.toString()}
                  className={styles.patent_item}
                  onClick={() => {
                    onPatentSelected(patent);
                    navigate('/infringements');
                  }}
                >
                  {patent.PatentNumber}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default HomeScreen;
