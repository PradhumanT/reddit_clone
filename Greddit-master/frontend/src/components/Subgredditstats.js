import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js'
import WithAuth from "./WithAuth";


const Subgredditstats = () => {
    const location = useLocation();
    const [memstats, setmemstats] = useState({});
    const [poststats, setpoststats] = useState({})
    const [visitorstats, setvisitorstats] = useState({})
    const [reportstats, setreportstats] = useState({});

    useEffect(() => {
        const fetchdata = async () => {
            let pageid = location.search.split("?")[1]
            console.log(pageid)
            let res = await fetch('http://localhost:3001/api/getmemberstats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:
                    JSON.stringify({ pageid: pageid })// body data type must match "Content-Type" header
            })
            let resp = await res.json()
            if (resp.error) {
                console.log(resp.error)
            }
            else {
                setmemstats(resp.countByJoiningDate);
                setpoststats(resp.postsbycreationdate);
                setvisitorstats(resp.visitorsbydate);
                setreportstats({"Number of Reports":resp.reportstat.numreportedposts , "Number of Deleted Posts":resp.reportstat.numdeletedposts});
            }
        }
        fetchdata();

    }, [])


    let memlabels = Object.keys(memstats);
    let memdata = Object.values(memstats);

    let postlabels = Object.keys(poststats);
    let postdata = Object.values(poststats);

    let visitorlabels = Object.keys(visitorstats);
    let visitordata = Object.values(visitorstats);

    let reportlabels = Object.keys(reportstats);
    let reportdata = Object.values(reportstats);

    let memchartData = {
        labels: memlabels,
        datasets: [
            {
                label: "Number of Members by Joining Date",
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(75,192,192,0.6)",
                hoverBorderColor: "rgba(75,192,192,1)",
                data: memdata
            }
        ]
    };

    let postchartData = {
        labels: postlabels,
        datasets: [
            {
                label: "Number of Posts Per Day",
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(75,192,192,0.6)",
                hoverBorderColor: "rgba(75,192,192,1)",
                data: postdata
            }
        ]
    };

    let visitorchartData = {
        labels: visitorlabels,
        datasets: [
            {
                label: "Number of Visitors Per Day",
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(75,192,192,0.6)",
                hoverBorderColor: "rgba(75,192,192,1)",
                data: visitordata
            }
        ]
    };

    let reportchartData = {
        labels: reportlabels,
        datasets: [
            {
                label: "Number of Reports and Deleted Posts",
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(75,192,192,0.6)",
                hoverBorderColor: "rgba(75,192,192,1)",
                data: reportdata
            }
        ]
    };

    let options = {
        scales: {
            xAxes: [
                {
                    type: "category",
                    labels: [memlabels,postlabels,visitorlabels,reportlabels]
                }
            ],
            yAxes: [
                {
                    type: "linear",
                    position: "left",
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        },
        barThickness: 50 // 
    };

    Chart.register(...registerables);

    return (
        <div>

            <div className="flex justify-center ">
                <div className="memberchart">
                    <h2 className="sm:text-3xl text-2xl font-medium title-font text-gray-900 mt-5 mb-10" >Bar Chart for Growth Rate of the Subgreddit in terms of Members over Time</h2>

                    <Bar className="w-2/3" data={memchartData} options={options} />
                </div>
            </div>

            <div className="flex justify-center ">
                <div className="postchart">
                    <h2 className="sm:text-3xl text-2xl font-medium title-font text-gray-900 mt-5 mb-10" >Number of Posts per Day</h2>

                    <Bar className="w-2/3" data={postchartData} width={800} height={600} options={options} />
                </div>
            </div>

            <div className="flex justify-center ">
                <div className="postchart">
                    <h2 className="sm:text-3xl text-2xl font-medium title-font text-gray-900 mt-5 mb-10" >Number of Visitors per Day</h2>

                    <Bar className="w-2/3" data={visitorchartData} width={800} height={600} options={options} />
                </div>
            </div>

            <div className="flex justify-center ">
                <div className="reportchart">
                    <h2 className="sm:text-3xl text-2xl font-medium title-font text-gray-900 mt-5 mb-10" >Number of Reports and Number of Deleted Posts</h2>

                    <Bar className="w-2/3" data={reportchartData} options={options} />
                </div>
            </div>

        </div>
    )
}

export default WithAuth(Subgredditstats);