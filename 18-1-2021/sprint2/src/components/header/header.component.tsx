import React, { ReactElement, useEffect } from 'react';
import { Container, Form, FormControl, Navbar } from 'react-bootstrap';
import styles from './header.module.css';
import LOGO from '../../assets/images/lorem-logo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCaseDetails } from '../../store/actions/cases.actions';

const Header = (): ReactElement => {
  const { caseInfo } = useSelector((state) => (state as any).claims);
  const dispatch = useDispatch();
  useEffect(() => {
    const caseId = 1;
    dispatch(fetchCaseDetails(caseId));
  }, []);
  return (
    <Navbar bg="dark" variant="dark" className={styles.nav_bar}>
      <Container fluid className={styles.container_flex}>
        <Navbar.Brand href="#home" style={{ flexGrow: 1 }}>
          <div className={styles.brand_details}>
            <img alt="text" src={LOGO} height="50" className="d-inline-block align-top" />
            <h4 className={styles.company_name}>{caseInfo?.CaseName || 'NA'}</h4>
          </div>
        </Navbar.Brand>
        <Navbar.Collapse id="navbarScroll" className={styles.right_section}>
          <Form className="d-flex">
            <FormControl type="search" placeholder="Search" className="me-2" aria-label="Search" />
          </Form>
          <FontAwesomeIcon icon={faBell} className={styles.icon} />
          <FontAwesomeIcon icon={faQuestionCircle} className={styles.icon} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Header;
