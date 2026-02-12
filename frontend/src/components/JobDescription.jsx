import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { id: jobId } = useParams();

  const [isApplied, setIsApplied] = useState(false);

  // Apply Job
  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);

        const updatedJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };

        dispatch(setSingleJob(updatedJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // Fetch Job
  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/get/${jobId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));

          const applied = res.data.job.applications?.some(
            (application) => application.applicant === user?._id
          );

          setIsApplied(applied);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user]);

  if (!singleJob) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{singleJob?.title}</h1>

          <div className="flex items-center gap-2 mt-4">
            <Badge variant="ghost" className="text-blue-700 font-bold">
              {singleJob?.position} Positions
            </Badge>

            <Badge variant="ghost" className="text-[#F83002] font-bold">
              {singleJob?.jobType}
            </Badge>

            <Badge variant="ghost" className="text-[#7209b7] font-bold">
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>

        <Button
          onClick={!isApplied ? applyJobHandler : undefined}
          disabled={isApplied}
          className={`rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
        Job Description
      </h1>

      <div className="my-4">
        <p className="font-bold my-1">
          Role:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.title}
          </span>
        </p>

        <p className="font-bold my-1">
          Location:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.location}
          </span>
        </p>

        <p className="font-bold my-1">
          Experience:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.experienceLevel || 0} yrs
          </span>
        </p>

        <p className="font-bold my-1">
          Salary:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.salary} LPA
          </span>
        </p>

        <p className="font-bold my-1">
          Total Applicants:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.applications?.length || 0}
          </span>
        </p>

        <p className="font-bold my-1">
          Posted Date:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.createdAt
              ? new Date(singleJob.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </p>

        <p className="font-bold my-1">
          Description:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.description}
          </span>
        </p>

        <h2 className="font-bold my-2">Requirements:</h2>
        <ul className="pl-8 list-disc text-gray-800">
          {singleJob?.requirements?.length > 0 ? (
            singleJob.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))
          ) : (
            <li>No specific requirements listed.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default JobDescription;
