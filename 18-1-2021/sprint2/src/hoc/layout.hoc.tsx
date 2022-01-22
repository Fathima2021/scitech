import { faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Header } from '../components';
const _linkStyle = {
  textDecoration: 'none',
};
const Layout = (props: any): ReactElement => {
  const [isNavopen, setIsNavopen] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header />
      <main style={{ display: 'flex', flex: 1, width: '100vw' }}>
        {!props.hideNav ? (
          <div
            style={{
              minWidth: isNavopen ? 200 : 20,
              height: '100%',
              position: 'relative',
              background: '#e4e4e4',
              borderRight: '1px solid var(--blue-50)',
            }}
          >
            {isNavopen ? (
              <Nav defaultActiveKey="/home" className="flex-column">
                <Nav.Link eventKey="link-1">
                  <button className="nav-button">
                    <Link style={_linkStyle} to="/terms">
                      Terms
                    </Link>
                  </button>
                </Nav.Link>
                <Nav.Link eventKey="link-1">
                  <button className="nav-button">
                    <Link style={_linkStyle} to="/figures">
                      Figures
                    </Link>
                  </button>
                </Nav.Link>
                <Nav.Link eventKey="link-2">
                  <button className="nav-button">
                    <Link style={_linkStyle} to="/figures">
                      Library
                    </Link>
                  </button>
                </Nav.Link>
                <Nav.Link eventKey="link-2">
                  <button className="nav-button">
                    <Link style={_linkStyle} to="/infringements">
                      Infringement Setup
                    </Link>
                  </button>
                </Nav.Link>
                <Nav.Link eventKey="link-2">
                  <button className="nav-button">
                    <Link style={_linkStyle} to="/validities">
                      Validity Setup
                    </Link>
                  </button>
                </Nav.Link>
                <Nav.Link eventKey="link-2">
                  <button className="nav-button">
                    <Link style={_linkStyle} to="/damages">
                      Damages
                    </Link>
                  </button>
                </Nav.Link>
                <Nav.Link eventKey="link-2">
                  <button className="nav-button">
                    <Link style={_linkStyle} to="/damages">
                      Case Evidence
                    </Link>
                  </button>
                </Nav.Link>
              </Nav>
            ) : null}
            <FontAwesomeIcon
              style={{
                position: 'absolute',
                bottom: 30,
                fontSize: 20,
                right: -10,
                color: 'var(--blue-50)',
                background: 'var(--white-100)',
              }}
              icon={isNavopen ? faChevronCircleLeft : faChevronCircleRight}
              onClick={() => setIsNavopen(!isNavopen)}
            />
          </div>
        ) : (
          <></>
        )}
        <div style={{ width: '100%' }}>{props.children}</div>
      </main>
    </div>
  );
};

export default Layout;

// render={(data: any) =>
//     //     props.isAuthenticated ? (
//     //       <Home>
//     //         <props.component {...props} />
//     //       </Home>
//     //     ) : (
//     //       <Redirect from="/" to="/login" />
//     //     )
//     //   }
