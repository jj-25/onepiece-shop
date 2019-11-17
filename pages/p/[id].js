import Layout from '../../components/MyLayout';
import fetch from 'isomorphic-unfetch';
import '../style/index.scss';

const Post = props => {
  const {item} = props;
  return(
    <Layout>
      <div className="product-info">
        <div className="product-l">
          <h3>{item.product}</h3>
          <div className="img-box"><img src={`../${item.img}`} alt=""/></div>
        </div>
        <div className="product-r">
          <div>{item.detail}</div>
          <div className="price"><span>價格：</span>{item.price}</div>
          {/* <div className="count"><span>庫存:</span>{item.count}</div> */}
        </div>
      </div>
    </Layout>
  );
};

Post.getInitialProps = async function(context) {
  const { id } = context.query;
  const res = await fetch(`http://localhost:3020/posts/${id}`);
  const item = await res.json();
  // console.log(id);
  return { item };
};

export default Post;