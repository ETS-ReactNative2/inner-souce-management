import React from "react";
import { Link } from "react-router-dom";
import StatusTags from "../Common/StatusTags/StatusTags";
import AuthorInfo from "../Common/AuthorInfo/AuthorInfo";
import { milestones } from "../../../assets/placeholder";

const OngoingJobCard = (props) => {
    console.log(props.job);
    const job = props.job;
    const completedMilestones = job.milestones.milestones.filter((milestone) => milestone.status === "completed").length;
    const totalMilestones = job.milestones.milestones.length;
    return (
        <div className={"bg-white rounded-lg p-6 border border-nebula-grey-400 select-text cursor-pointer transition duration-300 shadow-none hover:shadow-lg  " + props.className} key={job.id}>
            <Link to={"/jobDetails/"+job.id} >
                <div className="flex flex-col h-full  flex-1 justify-between">
                    <div className="">
                        <h2 className="text-sm font-semibold font-normal mb-4">{job.title}</h2>
                        <StatusTags statusTag={["ongoing"]} />
                    </div>
                    <div className="flex">
                        <div className="w-1/2 mt-4">

                            <p className="text-nebula-grey-600 text-xs font-semibold pb-0 tracking-widest">JOB PROGRESS</p>
                            <h1 className="text-lg font-semibold">{completedMilestones/totalMilestones * 100 + " %"}</h1>
                            <h1 className="text-sm font-semibold text-nebula-grey-700">{completedMilestones + " of " + totalMilestones + " milestones"}</h1>
                        </div>
                        <div className="w-1/2 mt-4">
                            <p className="text-nebula-grey-600 text-xs font-semibold pb-0 tracking-widest">POSTED BY</p>
                            <AuthorInfo
                                className="mt-8"
                                iconClass="w-12 h-12"
                                department = { job.createdBy.department}
                                name = { job.createdBy.name}
                                img = { job.createdBy.photoUrl}
                            />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default OngoingJobCard;
