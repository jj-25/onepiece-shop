import Layout from '../components/MyLayout';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import Modal from 'react-modal';
import React,{ useState,useEffect } from 'react';
import "./style/index.scss";
const Index = props => {
  const { data } = props;
  const [listData,setListData] = useState(data);
  const [cartData,setCartData] = useState([]);
  const [count,setCount] = useState(data.map(item=>1));
  const [modal,setModal] = useState([false,false]);
  const [orderData,setOrderData] = useState({});
  const [orderDetail,setOrderDetail] = useState(null);
  // console.log(listData);
  const changeCount = (e,type,index) =>{
    e.preventDefault();
    switch (type){
      case'plus':
        setCount(count.map((item,i)=>i===index?item+1:item));
        break;
      case'minus':
        count[index]>1?
          setCount(count.map((item,i)=>i===index?item-1:item))
        :null;
        break;
    };
  };
  const addToCart = (e,product,id,i) =>{
    e.preventDefault();
    fetch(`http://localhost:3020/posts/${id}`,{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        count: data[i].count - count[i]
      })
    }).then(async response => {
      if(response.status===200){
        const res =  await fetch('http://localhost:3020/posts');
        const data = await res.json();
        let temp = [...cartData];
        let findIndex = cartData.find(item=>item.id===id);
        if(!cartData.length||cartData.indexOf(findIndex)===-1){
          setCartData([
            ...cartData,
            {
              'id':id,
              'product':product,
              'count':count[i]
            }
          ]);
        }else{
          temp[temp.indexOf(findIndex)] =
          {
            'id':id,
            'product':product,
            'count':count[i]
          };
          setCartData(temp);
        };
        setListData(data);
      };
    });
  };
  const removeInCart = (e,id,i) =>{
    e.preventDefault();
    let number;
    data.map(item=>item.id===id?number=item.count:null);
    fetch(`http://localhost:3020/posts/${id}`,{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        count: number
      })
    }).then(async response => {
      if(response.status===200){
        const res =  await fetch('http://localhost:3020/posts');
        const data = await res.json();
        let b = [...cartData];
        b.splice(i,1);
        setCartData(b);
        setListData(data);
      };
    });
  };
  const sendOrderData = async(e) =>{
    e.preventDefault();
    let postData = {...orderData,id:new Date(),order:cartData};
    await fetch(`http://localhost:3020/orderData`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(postData)
    }).then(response => {
      setOrderDetail(postData);
      setCartData([]);
      setOrderData({});
      // console.log(response);
    });
  };
  // console.log(orderDetail);

  return(
    <Layout>
      <div>
        <div className="top-box">
          {/* <span onClick={()=>setModal([false,true])}>我要客訴</span> */}
          <span className="cart-btn">
            <div className="cart-box">
              {cartData.length?
                cartData.map((item,i)=>
                  <ul className="cart-list" key={item.product}>
                    <li>{i+1}.{item.product}</li>
                    <li>數量：{item.count}個</li>
                    <li className="btn" onClick={(e)=>removeInCart(e,item.id,i)}>移除</li>
                  </ul>
                )
              :<div style={{textAlign:'center'}}>購物車無商品</div>}
              {cartData.length?<div className="btn buy-btn" onClick={()=>setModal([true,false])}>購買</div>:null}
            </div>
          </span>
        </div>
      </div>
      <ul className="item-box">
        {listData.map((item,i) => (
          <li key={`${item.id}${i}`}>
            <Link href="/p/[id]" as={`/p/${item.id}`}>
              <a className="item">
                <h3>{item.product}</h3>
                <div className="img-box"><img src={item.img} alt=""/></div>
                <div className="price"><span>價格：</span>{item.price}</div>
                <div className="add-to-cart-box">
                  <ul className="buy-count">
                    <li>數量</li>
                    <li onClick={(e)=>changeCount(e,'minus',i)}>－</li>
                    <li>{count[i]}</li>
                    <li onClick={(e)=>changeCount(e,'plus',i)}>＋</li>
                  </ul>
                  <span className="btn" onClick={(e)=>addToCart(e,item.product,item.id,i)}>加入購物車</span>
                </div>
                <div className="count"><span>庫存：</span>{item.count}顆</div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <Modal
          isOpen={modal[1]}
          className="modal-inner"
          onRequestClose={()=>setModal([false,false])}
          ariaHideApp={false}
        >
        <div>
          <div>建議內容</div>
          <textarea resize="none" rows="3" cols="20"/>
        </div>
      </Modal>
      <Modal
          isOpen={modal[0]}
          className="modal-inner"
          onRequestClose={()=>setModal([false,false])}
          ariaHideApp={false}
        >
          {
            orderDetail?
              <div className="order-box">
                <div className="title">訂單資料</div>
                <div className="cusData">
                  <div>姓名：{orderDetail.name}</div>
                  <div>聯絡電話：{orderDetail.phone}</div>
                  <div>訂單地址：{orderDetail.address}</div>
                </div>
                {orderDetail.order.map((item,i)=>
                  <ul className="cart-list" key={item.product}>
                    <li>{i+1}.{item.product}</li>
                    <li>{item.count}個</li>
                  </ul>
                )}
              </div>
            :
              <div className="order-box">
                <div className="title">填寫訂單</div>
                <input type="text" placeholder="姓名" onBlur={(e)=>setOrderData({...orderData,name:e.target.value})}/>
                <input type="text" placeholder="電話" onBlur={(e)=>setOrderData({...orderData,phone:e.target.value})}/>
                <input type="text" placeholder="地址" onBlur={(e)=>setOrderData({...orderData,address:e.target.value})}/>
                <button className="btn" onClick={(e)=>sendOrderData(e)}>確認送出</button>
              </div>
          }
      </Modal>
    </Layout>
  );
};

Index.getInitialProps = async function() {
  const res = await fetch('http://localhost:3020/posts');
  const data = await res.json();
  return {
    data:data
  };
};

export default Index;