const Donate = () => {
  const accountID = localStorage.getItem('accountID');//anna
  const evenID = localStorage.getItem("evenID");
  let content=``;
  if(accountID!=null&&evenID!=null){
  content = `Account ${accountID} donate for event ${evenID}`;
  localStorage.removeItem("evenID");
  }else if(accountID!=null&&evenID==null){
    content = `Account ${accountID} donate for FurryFriendFund`;
  }
  const imageURL = `https://api.vietqr.io/image/970416-28029307-wjc5eta.jpg?accountName=TRUONG%20PHUC%20LOC&amount=0&addInfo=${content}`;
  console.log(imageURL)

  return (
    <div>
      <h1>QR Donate</h1>
      <img src={imageURL} alt="Sample" style={{ width: '500px', height: '400px' }} />
      <h4>Scan QR code above and check information: </h4>
      <h6>Bank: ACB bank</h6>
      <h6>Account number: 28029307</h6>
      <h6>Account name: TRUONG PHUC LOC</h6>
      <h6>Content: {content}</h6>
      <h1>Thank for your support!</h1>

    </div>
  );
};



export default Donate;
