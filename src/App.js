import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Reports from './pages/Reports';
import Products from './pages/Products';
import {  BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import Signup from './components/signup/signup';
import { auth, database } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './features/userSlice';
import { int, out, selectsub } from './features/subSlice';
import { get, ref } from 'firebase/database';



function App() {
  const user = useSelector(selectUser);
  const user2 =useSelector(selectsub)
  const dispatch = useDispatch();
  console.log(user,user2)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth =>{
      if(userAuth){
        dispatch(login({
          uid: userAuth.uid,
          email: userAuth.email
        }));
        
      }else{
        dispatch(logout());
          dispatch(out())
         
      }
    });

    return () =>{
      unsubscribe();
    }
  },[dispatch])

  useEffect(() => {
    
    const  fetchuserdetails = () => {
      if(user!==null){
        const starCountRef = ref(database,`users/${user.uid}`);
        get(starCountRef).then((snapshot) => {
            console.log(snapshot)
            const data = snapshot.val(); 
            if (snapshot.exists()) {
              dispatch(int(
                {
         fullname:data.fullname,
         serial:data.serial,
         height:data.height,
         diameter:data.diameter,
         refill:data.refill,

                }
              
              ))
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });
       
        




      }
    } 
   setTimeout(fetchuserdetails,5000)
   }, [dispatch,user])
   
  return (
    <div className="app">  
    
      <BrowserRouter>
        <Navbar/>
{!user? <Signup/>:
 <Switch >
     
 <Route path='/' exact component={Home } />

 <Route path='/reports' component={Reports} />
 <Route path='/products' component={Products} />
</ Switch>
}
         
       
      </BrowserRouter>
    
      </div>
  );
}

export default App;
