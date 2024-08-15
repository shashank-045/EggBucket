class ApiFeatures {
    constructor(que,string)   
    {
      this.query=que,
      this.qstring=string  
    }

    filtering(){
      let str={...this.qstring}
      const arr=['sort','fields','page','limit']
      arr.forEach(el=> delete str[el])

      
      str=JSON.stringify(str)
      str=str.replace(/\b(gte|gt|lte|lt)\b/g,(res)=>`$${res}`)
      str=JSON.parse(str)

      Object.keys(str).forEach(key => {
        if (key.includes('name') || key.includes('Name')) {
            str[key] = { $regex: str[key], $options: 'i' }; // Case-insensitive partial match
        }
    });

      this.query=this.query.find(str)

      return this
    }

    

    sorting()
    {
     if(this.qstring.sort){

        let str=this.qstring.sort;
        str=str.split(',').join(' ')
        this.query=this.query.sort(str)
     }
           
     return this
    }
    
    paginaton()
    {
      const sk=this.qstring.page*1 || 1;
      const lim=this.qstring.limit*1 || 50;

      this.query=this.query.skip((sk-1)*lim).limit(lim)

      return this
    }

    limiting()
    {
        if(this.qstring.fields)
          {
           let temp=this.qstring.fields.split(',').join(' ')
           this.query=this.query.select(temp)
          }
          else{
            this.query=this.query.select('-__v')
          }
          return this;
      }
}

module.exports=ApiFeatures