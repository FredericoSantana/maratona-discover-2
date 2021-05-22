const express = require('express');
const routes = express.Router()

const views = __dirname + "/views/"

const profile = {
    name: "Frederico",
    avatar: "https://avatars.githubusercontent.com/u/83486018?v=4",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 75
}

const jobs = [
    {
        id: 1,
        name: "Pizzaria Guloso",
        "daily-hours": 2,
        "total-hours": 1,
        created_at: Date.now(),
    },
    {
        id: 2,
        name: "One Two Project",
        "daily-hours": 3,
        "total-hours": 47,
        created_at: Date.now()
    },
]

function remainingDays(job) {
    //calculo de tempo restante
    const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()

    const createdDate = new Date(job.created_at)
    const dueDay = createdDate.getDate() + Number(remainingDays)
    const dueDateInMs = createdDate.setDate(dueDay)

    const timeDiffInMs = dueDateInMs - Date.now()

    //transformar milisegundos em dias
    const dayInMs = 1000 * 60 * 60 * 24
    const dayDiff = Math.floor(timeDiffInMs / dayInMs)

    //restam 'X' dias
    return dayDiff
}

//request, response
routes.get('/', (req, res) => {

    const updatedJobs = jobs.map((job) => {
        //ajustes no job
        const remaining = remainingDays(job)
        const status = remaining <= 0 ? 'done' : 'progress'

        return {
            ...job,
            remaining,
            status,
            budget: profile["value-hour"] * job["total-hours"]
        }
    })

    return res.render(views + "index", { jobs: updatedJobs })

})

routes.get('/job', (req, res) => res.render(views + "job"))
routes.post('/job', (req, res) => {
    
    //informa quantos elementos tem dentro do array
    const lastId = jobs[jobs.length - 1]?.id || 1;
    
    //pega os dados do formulário e empurra para a const jobs
    jobs.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now() //atribuindo data do momento
    }) 
    return res.redirect('/')
})
routes.get('/job-edit', (req, res) => res.render(views + "job-edit"))
routes.get('/profile', (req, res) => res.render(views + "profile", { profile }))

module.exports = routes;