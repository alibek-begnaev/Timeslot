import { useEffect, useState } from "react";
import useAxios from 'axios-hooks'
let intervalId = null
function HomePage() {
  const [form, setForm] = useState({id: '', token:'',api:''});

  const [
    { data, loading, error },
    executeGet
  ] = useAxios(
    {
      url: form.api+'/get',
      method: 'POST',
      headers: {
        Authorization : `Bearer ${form?.token}`
        },
    },
   
    { manual: true }
  )
  
  const [
    { data: newRes, loading: newResLoad, error: newResErr },
    executePost
  ] = useAxios(
    {
      url: form.api+'/set',
      method: 'POST',
      headers: {
        Authorization : `Bearer ${form?.token}`
        },
    },
   
    { manual: true }
  )
const dataFetch =()=>{
 const date = new Date()
   
    executeGet({
        data:{
            invoiceIds: [+form.id],
            timeFrom: date.getTime() + 86400000
        }
        
    })
  }
  function handleSubmit () {
    intervalId = setInterval(()=>{
        dataFetch()
    }, 5000)
  
  
  }
 
  useEffect(()=>{
    const date = new Date(form.timeFrom)
    if(  data?.payload?.timeSlots[0].timeFrom<date.getTime()){
    clearInterval(intervalId)
    executePost({
        data:{
            invoiceIds: [+form.id],
            timeFrom: data?.payload?.timeSlots[0].timeFrom
        }
    })
   console.log("newRes: ", newRes)
  }
  },[data])
  
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.className]: e.target.value }));
  };
 
 
  return (
    <>
      <div>
      <input
          className="api"
          onChange={handleChange}
          placeholder="API"
          type="text"
          
        />
        <input
          className="id"
          onChange={handleChange}
          placeholder="ID"
          type="text"
          
        />
        <input
          className="token"
          onChange={handleChange}
          placeholder="Token"
          type="text"
        />
        <input className="timeFrom" onChange={handleChange} type="datetime-local" />
      </div>
      <button onClick={handleSubmit} type="submit">
        Submit
      </button>

      <div>{data && data?.payload?.timeSlots.map((item, index)=> {
        const d = new Date(item?.timeFrom)
      
       return (
       <div key={index}> {d.toLocaleDateString()}</div>
       )
      })}</div>
    </>
  );
}

export default HomePage;
