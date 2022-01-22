import {Spinner} from 'react-bootstrap';

const Loader = () => {
  console.log("loooding....")
  return (
    <div className="container">
      <div className="row">
        <div className="col d-flex justify-content-center my-5">
        <>
        <Spinner animation="grow" variant="primary" />
        <span className="visually-hidden">Loading...</span>
       </>

       <>
        <Spinner animation="grow" variant="primary" />
        <span className="visually-hidden">Loading...</span>
       </>

       <>
        <Spinner animation="grow" variant="primary" />
        <span className="visually-hidden">Loading...</span>
       </>

        </div>

      </div>
      
    </div>
  )
}

export default Loader

