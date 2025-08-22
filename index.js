const express = require('express')
const cors = require ('cors')
const app = express()
let notes = [
    {    id: "1",    
        content: "HTML is easy",    
        important: true  
    },  
    {    id: "2",    
        content: "Browser can execute only JavaScript",    
        important: false  
    }, 
     {    id: "3",   
         content: "GET and POST are the most important methods of HTTP protocol",    
         important: true  
    }
]
app.use(cors())
app.use(express.json())


const generatedId = () =>{
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => Number(n.id))):0
    return String(maxId + 1)
}


app.get('/',(req,res)=>{
    res.send('<h1>Hello World</h1>')
})
app.post('/api/notes',(req,res)=>{
   
    const body = req.body
    if (!body || !body.content){
        return res.status(400).json({ error: 'Content missing' })
    }
    const note = {
        content: body.content,
        important: body.important || false,
        id: generatedId()
    }
     
    notes = notes.concat(note)
    res.json(note)
})
app.get('/api/notes',(req,res)=>{
    res.json(notes)
})
app.get('/api/notes/:id',(req,res)=>{
    const id = req.params.id
    const note = notes.find(note => note.id === id)
    res.json(note || { error: 'Note not found' })
})
app.delete('/api/notes/:id',(req,res)=>{
    const id = req.params.id
    notes = notes.filter(n => n.id !== id)
    res.status(204).end
})
app.put('/api/notes/:id',(req,res)=>{
    const id = req.params.id
    const body = req.body
    const note = notes.find(n => n.id === id)
    if (!note) {
        return res.status(404).json({ error: 'Note not found' })
    }
    const updatedNote = {
        ...note,
        content: body.content,
        important: body.important
    }
    notes = notes.map(n => n.id === id ? updatedNote : n)
    res.json(updatedNote)
})

const PORT = process.env.PORT || "3001"
app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`)
})
