import { faEllipsisH, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement } from 'react';
import styles from './activity-pane.module.css';
import { Dropdown } from 'react-bootstrap';
import { CustomToggle } from '..';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useState,useEffect} from 'react'
import Loader from './Loader';
import EndMssg from './EndMssg';
export interface ActivityPaneProps {
  activityList?: any[];
}

const ActivityPane = (props: ActivityPaneProps): ReactElement => {
  const { activityList } = props;
  const [items,setItems]=useState<any[]>([]);
  const [noMore,setnoMore]=useState(true);
  const [page,setPage]=useState(2);
  useEffect(()=>{
    const getComments = async () =>{
      const res=await fetch(`http://localhost:3005/v1/activityHistory?page=${page}`);
      const data= await res.json();
      setItems(data.data.rows);
    };
    getComments();
   
  },[]);
  
  const fetchComments = async () =>{
    const res=await fetch(` http://localhost:3005/v1/activityHistory?page=${page}`);
    const data= await res.json()
    return data.data;
  };
  const fetchData= async()=>{
    const commentsServer =await fetchComments();
    console.log("commentsServer",commentsServer);
const refresh= async()=>{


  setItems([...items,...commentsServer.rows]);


  if( commentsServer.length < commentsServer.count)
  {
    setnoMore(false)
  }
  setPage(page+1);

}



   return refresh();
    
    }


  return (
    <Dropdown.Menu style={{ width: '40vw', height:"50vh", overflowY:"scroll" }}>
      <Dropdown className={styles.activity_options}>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-basic" data-toggle="dropdown">
          <FontAwesomeIcon icon={faEllipsisH} />
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ width: '10vw' }}>
          <Dropdown.Item>Mark all as read</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <InfiniteScroll
     dataLength={items.length} //This is important field to render the next data
     next={fetchData}
     hasMore={noMore}
     loader={<Loader/>}
     endMessage={
     <EndMssg/>
     }
  // below props only if you need pull down functionality
  refreshFunction={refresh}
  pullDownToRefresh
  pullDownToRefreshThreshold={50}
  pullDownToRefreshContent={
    <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
  }
  releaseToRefreshContent={
    <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
  }
>









      {/* <InfiniteScroll
      dataLength={items.length} //This is important field to render the next data
      next={fetchData}
      hasMore={noMore}
      loader={<Loader/>}
      endMessage={
      <EndMssg/>
      }

> */}
{items.map((item) => {
            return <ol key={item.id}>
                      <li > {item.comments} </li>
                    </ol>;
          })}
</InfiniteScroll>
    </Dropdown.Menu>
  );
};

export default ActivityPane;

