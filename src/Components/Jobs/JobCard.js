import InfoTag from "../Common/InfoTag/InfoTag";
import AuthorInfo from "../Common/AuthorInfo/AuthorInfo";
import StatusTags from "../Common/StatusTags/StatusTags";
import React from "react";
import { Link } from "react-router-dom";
import  { getDuration } from "../../HelperFunctions/DurationParser";

const JobCard = (props) => {
    return (
        <Link to = { "/jobDetails/"+props.data.id} >
            <div className={"w-full p-6 bg-white mt-4 rounded-lg " + (props.manageJobs
                ? ""
                : "transition duration-300 shadow-none cursor-pointer hover:shadow-lg border border-nebula-grey-400")}
            key={props.data.id}>
                <h1 className="text-md font-semibold">{props.data.title}</h1>
                <div
                    className="mt-2 text-sm leading-relaxed text-nebula-grey-700 mb-8">
                    {props.data.description}
                </div>
                <div className="flex mb-4 flex-wrap">
                    <div className="flex flex-1 justify-evenly md:justify-start">
                        <div
                            className="flex flex-1 flex-col md:flex-row md:flex-initial">
                            <div className="mr-6">
                                <InfoTag title="MILESTONES" data={props.data.milestones.totalCount + " Milestones"}/>
                            </div>
                            <div className="mr-6 mt-4 md:mt-0">
                                <InfoTag title="DIFFICULTY" data={props.data.difficulty}/>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col md:flex-row md:flex-initial">
                            <div className="mr-6">
                                <InfoTag title="DURATION" data={getDuration(props.data["milestones"]["milestones"])} />
                            </div>
                            <div className="mr-6 mt-4 md:mt-0">
                                <InfoTag title="WORKING" data={props.data.applications.acceptedCount + ( props.data.applications.acceptedCount > 1 ? " users":" user")} /> 
                            </div>
                            <div className="mr-6 mt-4 md:mt-0">
                                <InfoTag title="SKILLS NEEDED" data={props.data.skills.map((skill, index) => skill.value + " ")} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <AuthorInfo 
                            className="mt-8" 
                            iconClass="w-12 h-12" 
                            department = {props.data.createdBy.department} 
                            name = {props.data.createdBy.name} 
                            img = {props.data.createdBy.photoUrl}
                        />
                    </div>
                </div>
                <hr />
                <div className="flex flex-col flex-wrap mt-4 justify-left md:flex-row">
                    <div className="flex-1">
                        <div className="flex items-center">
                            <div><StatusTags statusTag={[props.data.status.toLowerCase(), props.data.userApplicationStatus? props.data.userApplicationStatus.toLowerCase() : ""]} /></div>
                            <div className="text-nebula-grey-600 ml-2 text-sm">{"created on " + props.data.timeCreated.split("T")[0]}</div>
                        </div>
                    </div>
                    <div className="py-4 md:py-0">
                        <a href="#" className="cursor-pointer text-sm font-semibold text-nebula-blue hover:text-blue-700">View Details</a>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default JobCard;
