import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { useNavigate } from 'react-router-dom';
import './Recommendation.css';
import Title from './Title';
import { domain } from "./Hostdata";

const Recommendation = () => {

  const [searchbar,setsearchbar]=useState("");
  const [isverified,setverified]=useState(false);
  const navigate=useNavigate();
  const [memberreq,setmemreq]=useState([]);
  const[userprofiles,setprofiles]=useState([]);

  useEffect(() => {
    Recommendskills();
  },[]);

  function handleopen(uname){
    navigate("/DisplayProfile/"+uname);
  }

  async function Recommendskills(){

      try{
        const response=await fetch(domain+"/teamrequest/filter",{
          method:"get",
          credentials:"include",
                  headers:{
                      "Content-Type":"application/json"
                  }
          });
          const res=await response.json();
          let res1=await res;
          setmemreq(res1);
          console.log("entered");
          
          console.log(JSON.parse(res1[0].skills));
      } 
      catch (error) {
        console.error('Error fetching or parsing data:', error);
      }
  }

  async function searchskills(){
    if(!searchbar || searchbar==="")
        return;
    console.log("skills :"+searchbar);
      try{
        const response=await fetch(domain+"/profile/getprofiles",{
          method:"get",
          credentials:"include",
                  headers:{
                      "Content-Type":"application/json"
                  },
                  body:JSON.stringify({"skills":searchbar})
          });
          const res=await response.json();
          let res1=await res;
          if(await res1.message==="Unauthorized"){
              navigate("/Login");
          }
          console.log("success");
          let currentUser=await res[0];
          setprofiles(await res[1]);
          console.log(userprofiles);
      } 
      catch (error) {
        console.error('Error fetching or parsing data:', error);
      }
  }

  function convertskillsarray(arr){
    arr=JSON.parse(arr);
    let arrayres="";
    for(let i=0;i<arr.length;i++){
        arrayres=arrayres+arr[i];
        if(i!==arr.length-1)
            arrayres=arrayres+", "
    }
    return arrayres;
  }

  return (
    <>
    <NavBar />
    <Title />
    <div className='Rtotalprofilebox'>
            <div className='Rreqbtndiv'>
              <button className='Rreqbtn' onClick={()=>navigate("/Request")}>Upload New Team member Request</button>
            </div>
            <div className='Rskillsboxforsearch'>
            {
              memberreq.map((e,k) => 
                                          <div className='Rprofilebox'>
                                
                                          <div className='Rdetailbox'>
                                            <p>Name  : {e.uploader}</p>
                                            <p>Skills  : {convertskillsarray(e.skills)}</p>
                                            <p>Description  : {e.description}</p>
                                            <button className='Ropenbtn' onClick={()=>handleopen(e.uploader)}>view profile</button>
                                          </div>
                                          </div>
                                      )
            }
            </div>
      </div>
    </>)
}

export default Recommendation