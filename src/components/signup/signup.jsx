import React, { useState,useCallback } from 'react';
import "./signup.scss"
import { useHistory } from "react-router-dom";

import { toast } from 'react-toastify';
import { motion } from "framer-motion"
import 'react-toastify/dist/ReactToastify.css';
import { auth, createUserDocument, database } from '../../firebase';
import { child, get, ref } from 'firebase/database';

toast.configure();
 const Signup=()=> {
    let history = useHistory();
    const [page, setPage] = useState(1);
    const [login,setLogin] = useState(false)
    const [user, setUser] = useState({
        password: "",
        email: "",
        fullname:"",
        diameter:"",
        refill:"",
        serial:"",
        height: "",
      });
  
      const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
      },[user]);
    const signIn =(e) =>{
    e.preventDefault();
    setLogin(true)
        auth.signInWithEmailAndPassword(
            user.email,
            user.password
    
        ).then((authUser) => {
     setLogin(false)
     history.push("/")
     toast.success("Successfully logged In")
                }).catch((error) =>{
                    setLogin(false)
                    toast.error(error.message)
                   
                });}
                const registers = (e) => {

                    e.preventDefault();
                    const starCountRef = ref(database,user.serial);
                    get(starCountRef).then((snapshot) => {
                        console.log(snapshot)
                        if (snapshot.exists()) {
                            setLogin(true);
                            auth.createUserWithEmailAndPassword(
                                user.email,
                                user.password
                            ).then((authUser) => {
                                createUserDocument(user,auth.currentUser.uid)
                                setLogin(false)
                                history.push("/")
                                toast.success("Successfully logged In")
                                      
    
                        auth.currentUser.updateProfile({
                            displayName: user.fullname
                        })
                               }).catch((error) =>{
                                setLogin(false)
                            toast.success(error.message)
                            });
                        } else {
                          toast.error("No data available");
                        }
                      }).catch((error) => {
                        console.error(error);
                      });
                   
                    
                  
                } 
                const forgots =(e) =>{
                    e.preventDefault();
                    setLogin(true);
                    auth.sendPasswordResetEmail(
                        user.email,
                    ).then(() => {
                        setLogin(false)
                        toast.success("Reset Mail send")
                            }).catch((error) =>{
                                setLogin(false)
                                toast.error(error.message)
                            });
                }
                
                console.log(user)
  return <div className='Signup_box'>
   <motion.div 
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: .8 }}
  className="flex_1">
  <h1>Aqua smart system</h1>
    {
        page===2 &&
        <motion.div 
        
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: .8 }}
        className="signup">
                 <form onSubmit={registers} >
        <h1 >Sign up</h1>
        <input  onChange={handleChange} name='fullname' required={true} value={user.fullname}  type="text" placeholder='Full Name'></input>
        <input  onChange={handleChange} name='email' required={true} value={user.email} type="email" placeholder='Email'></input>
        <input  onChange={handleChange} name='serial' required={true} value={user.serial} type="text"  placeholder='Tank Serial Number'></input>
        <input  onChange={handleChange} name='height' required={true} value={user.height}   placeholder="Tank Height"></input>
        <input  onChange={handleChange} name='diameter' required={true} value={user.diameter}  type="text" placeholder='Diameter'></input>
        <input  onChange={handleChange} name='refill' required={true} value={user.refill}  type="text" placeholder='Refill percentage'></input>
        <input  onChange={handleChange} name='password' required={true} value={user.password} type="password" placeholder='Password'></input>

        <button  type="submit" disabled={login} >{login?"Please wait":"SIGN UP"}</button>
        </form>
    <h5 className='already_account'>Already have an account ? <span onClick={() => {setPage(1)}}>  Sign in</span></h5>
        </motion.div>
   
    }
{
page===1 &&       
<motion.div 
initial={{ opacity: 0 }}
whileInView={{ opacity: 1 }}
transition={{ duration: .8 }}
>
<form onSubmit={signIn}>
<h1 className='sign_in'>Sign in</h1>
<h5 className='already_account  to_sign_up'>Don't have an account ? <span onClick={() => {setPage(2)}}>  Sign up here</span></h5>

<input   onChange={handleChange} name='email' required={true} value={user.email} type="email" placeholder='Email'></input>
<input  onChange={handleChange}  name='password'required value={user.password} type="password" placeholder='Password'></input>
<h5 className='forgot_h5' onClick={()=>{setPage(3)}}>Forgot password ?</h5>
<button  type="submit" disabled={login} >{login?"Please wait":"SIGN IN"}</button>


</form>
</motion.div>
}
{
page===3 &&     
<motion.div 
initial={{ opacity: 0 }}
whileInView={{ opacity: 1 }}
transition={{ duration: .8 }}
>  <form onSubmit={forgots}>
<h1 className='sign_in'>Forgot your password ?</h1>

<input  className='forgot_margin' onChange={handleChange} name='email' required={true} value={user.email} type="email" placeholder='Enter your email address'></input>
<button type="submit" disabled={login}>{login?"Please wait":"SEND"}</button>
<h5 className='already_account  to_sign_up sign_redirect' >Did you remember your password ?<span onClick={() => {setPage(1)}}> Sign in</span></h5>
</form>
</motion.div>
}
</motion.div>
      
  </div>;
}

export default Signup;
