import React, { useCallback, useEffect, useState } from 'react';
import LiquidFillGauge from 'react-liquid-gauge';
import { color } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
import "./hom.css";

import { auth, database } from '../firebase';
import {  ref, onValue, set, query, limitToLast} from "firebase/database";
import { FormControlLabel, FormGroup, Slider, styled, Switch} from '@mui/material';
import { Box } from '@mui/system';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer
  } from "recharts";
import { useSelector } from 'react-redux';
import { selectsub } from '../features/subSlice';

function Home() {
  const user2 =useSelector(selectsub)
      const [distance,setDistance]=useState(20);
      const [checked,setChecked]=useState("false");
      const [phvalue,setPhvalue]=useState([]);
      const [turbidity,setTurbidity]=useState([]);
      const [daily,setDaily]=useState([]);
      const [temp,setTemp]=useState([]);
      const [height,setHeight]=useState(18);
      const [refil,setRefill]=useState(60);
  const radius = 100;
  const interpolate = interpolateRgb("#0000FF", "#ADD8E6");
  const fillColor = interpolate(50 / 100);
  const gradientStops = [
      {
          key: '0%',
          stopColor: color(fillColor).darker(0.5).toString(),
          stopOpacity: 1,
          offset: '0%'
      },
      {
          key: '50%',
          stopColor: fillColor,
          stopOpacity: 0.75,
          offset: '50%'
      },
      {
          key: '100%',
          stopColor: color(fillColor).brighter(0.5).toString(),
          stopOpacity: 0.5,
          offset: '100%'
      }
  ];
  const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));
  const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const marks = [
  {
    value: 0,
  },
  {
    value: 20,
  },
  {
    value: 40,
  },
  {
    value: 60,
  },
  {
    value: 80,
  },
  {
    value: 100,
  },
];

const IOSSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#3880ff' : '#3880ff',
  height: 2,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    '&:focus, &:hover, &.Mui-active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&:before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  },
}));


  
 console.log(phvalue) 
 useEffect(() => {
  if(user2?.serial){
    const temp =  query(ref(database, `${user2?.serial}_3/temp/value`),limitToLast(10))
    const unsubscribe2 =  onValue(temp, (snapshot) => {
      setTemp([])
      const data = snapshot.val(); 
  
  console.log(data)
  Object.entries(data).forEach(([index,value]) => {
  console.log(value,index);
  setTemp(prevState => 
  [...prevState,{
    name:index,
    temp:value,
  
   
  
  }]
  )
  })
  
    });
    return () => {
      unsubscribe2();
     }
  }
 
 

 }, [user2])
 useEffect(() => {
  if(user2?.serial){
    const phvalues =  query(ref(database, `${user2?.serial}_1/PH/value`),limitToLast(10))
    const unsubscribe2 =  onValue(phvalues, (snapshot) => {
      setPhvalue([])
      const data = snapshot.val(); 
  
  console.log(data)
  Object.entries(data).forEach(([index,value]) => {
  console.log(value,index);
  setPhvalue(prevState => 
  [...prevState,{
    name:index,
    PH:value,
  
   
  
  }]
  )
  })
  
    });
   
     return () => {
      unsubscribe2();
     }
  }

 }, [user2])
 useEffect(() => {
  if(user2?.serial){
    const turbidity =  query(ref(database, `${user2?.serial}_4/turbid/value`),limitToLast(10))
    const unsubscribe3 =  onValue(turbidity, (snapshot) => {
      setTurbidity([])
      const data = snapshot.val(); 
  
  console.log(data)
  Object.entries(data).forEach(([index,value]) => {
  console.log(value,index);
  setTurbidity(prevState => 
  [...prevState,{
    name:index,
    turbidity:value,
  
   
  
  }]
  )
  })
  
    });
   
     return () => {
      unsubscribe3();
     }
  }
 
 }, [user2])

 
 useEffect(() => {
  if(user2?.serial){
    const daily =  query(ref(database, `${user2?.serial}_2/vol`),limitToLast(10))
    const unsubscribe3 =  onValue(daily, (snapshot) => {
      setDaily([])
      const data = snapshot.val(); 
  
  console.log(data)
  Object.entries(data).forEach(([index,value]) => {
  console.log(value,index);
  setDaily(prevState => 
  [...prevState,{
    name:index,
    usage:value/1000,
  
   
  
  }]
  )
  })
  
    });
   
     return () => {
      unsubscribe3();
     }
  }

 }, [user2])
 
useEffect(() => {
  if(user2?.serial){
    const starCountRef = ref(database, `${user2?.serial}`);
 
    const unsubscribe=  onValue(starCountRef, (snapshot) => {
       const data = snapshot.val(); 
       const distance = (data) => {
         const data2 = user2.height-data
 return (data2/user2.height)*100;
       }
       if(data){
       const percen =  distance(data.DISTANCE)
           console.log(data)
         setDistance(percen);
         if(data.man==="true"){
             setChecked(true)
             console.log(checked)
         }else{
             setChecked(false)
             console.log(checked)
         }
         setRefill(parseInt(100-((data?.refill/data?.height)*100)))
         setHeight(data?.height)
       }
     });
 
 
   return () => {
     unsubscribe();
 
   }
  }
  
}, [user2])
console.log(checked)
const handlechange = useCallback((event,newvalue) => { 
  console.log(user2?.serial)
    set(ref(database, `${user2?.serial}/man` ),newvalue?"true":"false");
 

},[checked]);

const handlechange2 = useCallback((event,newvalue) => { 
console.log(user2?.serial)
  set(ref(database, `${user2?.serial}/refill` ),parseInt( height-((newvalue*height)/100)));

},[user2]);
  return (
    <div className='home'>
      <div className="top_name_signout">
      <h2 className='welcome'>WELCOME BACK <br></br>{user2?.fullname}</h2>
      <span  onClick={() => {auth.signOut()}} className='signout'>Signout</span>
      </div>

      <div className="flex_div1">
        <div className="flex_sub submod">
            <div className="submodsub">
            <h2>Manual controls</h2>

<FormGroup>
<h3 >Motor status</h3>
<FormControlLabel
className='switch'
   control={<IOSSwitch sx={{ m: 1 }} defaultValue={checked} checked={checked}  onChange={handlechange}/>}
   label="Turn on the motor"
 />

</FormGroup>
<Box sx={{ width: 250 }}>
 <h3 >Refill percentage</h3>
 <IOSSlider
   aria-label="ios slider"
   defaultValue={refil}
   onChange={handlechange2}
   marks={marks}
   valueLabelDisplay="on"
 />
 </Box>
            </div>
            <div className="submodsub">
            <LiquidFillGauge
                    style={{ margin: '0 auto' }}
                    width={radius * 2}
                    height={radius * 2}
                    value={distance}
                    percent="%"
                    textSize={1}
                    textOffsetX={0}
                    textOffsetY={0}
                    textRenderer={(props) => {
                        const value = Math.round(props.value);
                        const radius = Math.min(props.height / 2, props.width / 2);
                        const textPixels = (props.textSize * radius / 2);
                        const valueStyle = {
                            fontSize: textPixels,
                            
                        };
                        const percentStyle = {
                            fontSize: textPixels * 0.6
                        };

                        return (
                            <tspan>
                                <tspan className="value" style={valueStyle}>{value}</tspan>
                                <tspan style={percentStyle}>{props.percent}</tspan>
                            </tspan>
                        );
                    }}
                    riseAnimation
                    waveAnimation
                    waveFrequency={2}
                    waveAmplitude={4}
                    gradient
                    gradientStops={gradientStops}
                    circleStyle={{
                        fill: fillColor
                    }}
                    waveStyle={{
                        fill: fillColor
                    }}
                    textStyle={{
                        fill: color('#fff').toString(),
                        fontFamily: 'Arial'
                    }}
                    waveTextStyle={{
                        fill: color('#fff').toString(),
                        fontFamily: 'Arial'
                    }}
                    onClick={() => {
                        this.setState({ value: Math.random() * 100 });
                    }}
                />
            </div>
            <div className='submodsub'>
              <h6>WATER USAGE - {(daily[daily?.length-1]?.usage)} LITERS</h6>
              <h6>TEMPERTURE - {(temp[temp?.length-1]?.temp)} CELSIUS</h6>
              <h6>WATER PH - {(phvalue[phvalue?.length-1]?.PH)}</h6>
              <h6>TURBIDITY - {(turbidity[turbidity?.length-1]?.turbidity)}</h6>
              <span className={(temp[temp?.length-1]?.temp<60 && phvalue[phvalue?.length-1]?.PH>6.5 && phvalue[phvalue?.length-1]?.PH<7.8 && turbidity[turbidity?.length-1]?.turbidity<20 ) ? "pure" : "impure"}>PURITY STATUS - {(temp[temp?.length-1]?.temp<60 && phvalue[phvalue?.length-1]?.PH>6.5 && phvalue[phvalue?.length-1]?.PH<7.8 && turbidity[turbidity?.length-1]?.turbidity<20 ) ? "PURE" : "IMPURE"} </span>
            </div>
  
   
        </div>
        
        <div className="flex_sub submod2">
            <h2>Daily usage</h2>
            <ResponsiveContainer width="100%" height={200}>
            <BarChart
      width={500}
      height={200}
      data={daily}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    

      <Bar dataKey="usage" fill="#30D5C8" />
    </BarChart>
            </ResponsiveContainer>
  
        </div>
      </div>
      <div className="flex_div1">
      <div className="flex_sub">
            <h2>Temperture</h2>
            <ResponsiveContainer width="95%" height={200}>
            <LineChart
          width={500}
          height={200}
          data={temp}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temp" stroke="#8884d8" activeDot={{ r: 8 }} />
      
        </LineChart>
        </ResponsiveContainer>
        </div>
        <div className="flex_sub">
        <h2>PH</h2>
          <ResponsiveContainer width="100%" height={200} >
            <LineChart
          
          width={500}
          height={200}
          data={phvalue}
          
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="PH" stroke="#FF0000" activeDot={{ r: 8 }} />
        
        </LineChart>
        </ResponsiveContainer>
       
        </div>
        
       </div>  <div className="flex_div1">
      <div className="flex_sub">
            <h2>Turbidity

              


          
            </h2>
            <ResponsiveContainer width="95%" height={200}>
            <LineChart
          width={500}
          height={200}
          data={turbidity}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="turbidity" stroke="#FF0000" activeDot={{ r: 8 }} />
        </LineChart>
        </ResponsiveContainer>
        </div>
       
       </div>
   </div>
 
  );
}

export default Home;
