import Layout from '../components/MyLayout';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import "./style/index.scss"
const data =[
  {
    "id":"luffy",  
    "item":"橡膠果實",
    "price":200,
    "count":100,
    "img":"rubber.jpg"
  },
  {
    "id":"ice",  
    "item":"燒燒果實",
    "price":300,
    "count":55,
    "img":"fire.jpg"
  },
  {
    "id":"brook",  
    "item":"黃泉果實",
    "price":300,
    "count":80,
    "img":"death.jpg"
  }
]
const Index = props => (
  <Layout>
    <h1>Batman TV Shows</h1>
    <ul className="item-box">
      {data.map(item => (
        <a key={item.id}>
          <li className="item">
            {/* <Link href="/p/[id]" as={`/p/${item.id}`}> */}
              <h3>{item.item}</h3>
              <div className="img-box"><img src={item.img} alt=""/></div>
              <div className="price"><span>價格:</span>{item.price}</div>
              <div className="count"><span>數量:</span>{item.count}</div>
            {/* </Link> */}
          </li>
        </a>
      ))}
    </ul>
  </Layout>
);

Index.getInitialProps = async function() {
  const res = await fetch('https://api.tvmaze.com/search/shows?q=batman');
  const data = await res.json();

  console.log(`Show data fetched. Count: ${data.length}`);

  return {
    shows: data.map(entry => entry.show)
  };
};

export default Index;