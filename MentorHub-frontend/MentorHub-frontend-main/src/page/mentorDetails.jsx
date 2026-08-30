import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import mentorAPI from "../apiManger/mentor";
import reviewAPI from "../apiManger/review";
import useUserStore from "../store/user";
import { Spin } from "antd";
import toast from "react-hot-toast";
import {
  AiFillFacebook,
  AiFillGithub,
  AiFillInstagram,
  AiFillLinkedin,
  AiFillTwitterCircle,
} from "react-icons/ai";
import ServiceCardUserSide from "../components/ServiceCardUserSide";
import Layout from "../components/Layout";
import StarRating from "../components/StarRating";
import { BiErrorAlt } from "react-icons/bi";

const MentorDetails = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const { user } = useUserStore();

  const [mentor, setMentor] = useState();
  const [services, setServices] = useState();
  const [mentorLoading, setMentorLoading] = useState(true); // Separate loading state for mentor
  const [servicesLoading, setServicesLoading] = useState(true); // Separate loading state for services

  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    reviewCount: 0,
  });
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        setMentorLoading(true);
        const response = await mentorAPI.getMentorByUsername(username);
        setMentor(response?.data?.mentor);
        setMentorLoading(false); // Stop loading after mentor data is fetched
        setServices(response?.data?.services);
        setServicesLoading(false); // Stop loading after services data is fetched
      } catch (error) {
        console.error("Error fetching mentor details:", error);
        setMentorLoading(false); // Stop loading even if an error occurs
        setServicesLoading(false);
      }
    };

    fetchMentorDetails();
  }, [username]);

  const fetchReviews = async (mentorId) => {
    setReviewsLoading(true);
    try {
      const res = await reviewAPI.getMentorReviews(mentorId);
      setReviews(res?.data?.reviews || []);
      setReviewStats({
        averageRating: res?.data?.averageRating || 0,
        reviewCount: res?.data?.reviewCount || 0,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (mentor?._id) {
      fetchReviews(mentor._id);
    }
  }, [mentor?._id]);

  const onSubmitReview = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a star rating");
      return;
    }

    setSubmitting(true);
    try {
      await reviewAPI.createReview({ bookingId, rating, comment });
      toast.success("Thanks for your feedback!");
      setRating(0);
      setComment("");
      fetchReviews(mentor._id);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not submit your review"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto min-h-screen">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Mentor's Profile */}
          <div className="col-span-1 p-6">
            {mentorLoading ? (
              <div className="flex items-center justify-center h-full">
                <Spin size="large" />
              </div>
            ) : mentor ? (
              <>
                <img
                  src={
                    mentor?.photoUrl ||
                    `https://ui-avatars.com/api?name=${mentor?.name}`
                  }
                  alt={`${mentor?.name}'s avatar`}
                  className="w-48 h-48 mx-auto border rounded-full"
                />
                <h2 className="mt-4 text-3xl font-bold text-center dark:text-white">
                  {mentor?.name}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <StarRating value={reviewStats.averageRating} size="text-sm" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {reviewStats.reviewCount > 0
                      ? `${reviewStats.averageRating.toFixed(1)} (${reviewStats.reviewCount} review${reviewStats.reviewCount === 1 ? "" : "s"})`
                      : "No reviews yet"}
                  </span>
                </div>
                <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
                  {mentor?.profile?.title}
                </p>
                <div className="flex justify-center mt-4">
                  {mentor?.profile?.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 mx-1 text-xs text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-200"
                    >
                      {tag || "Tags"}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-center text-gray-500 dark:text-gray-400">
                  {mentor?.profile?.bio || "Mentor bio"}
                </p>
                <h3 className="mt-8 text-lg font-semibold text-center dark:text-white">
                  Connect with me
                </h3>
                <div className="flex justify-center mt-4 space-x-4">
                  <a
                    href={
                      mentor?.profile?.social?.linkedin || "www.linkedin.com"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AiFillLinkedin className="text-3xl text-blue-600" />
                  </a>
                  <a
                    href={mentor?.profile?.social?.github || "www.github.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AiFillGithub className="text-3xl text-gray-800 dark:text-gray-200" />
                  </a>
                  <a
                    href={mentor?.profile?.social?.twitter || "www.twitter.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AiFillTwitterCircle className="text-3xl text-blue-400" />
                  </a>
                  <a
                    href={
                      mentor?.profile?.social?.facebook || "www.facebook.com"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AiFillFacebook className="text-3xl text-blue-700" />
                  </a>
                  <a
                    href={
                      mentor?.profile?.social?.instagram || "www.instagram.com"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AiFillInstagram className="text-3xl text-pink-500" />
                  </a>
                </div>
              </>
            ) : (
              <p>Mentor not found.</p>
            )}
          </div>

          {/* Mentor's Services */}
          <div className="col-span-2 p-6 h-screen bg-[#F5F5F5] dark:bg-gray-900">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Book a Session
            </h3>

            {servicesLoading ? (
              <div className="flex items-center justify-center h-full">
                <Spin size="large" />
              </div>
            ) : services && services.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {services.map((service) => (
                  <ServiceCardUserSide
                    username={mentor?.username}
                    service={service}
                    key={service?._id}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-700 dark:text-gray-300">
                <BiErrorAlt className="w-24 h-24 mb-4 text-blue-500" />
                <h3 className="mb-2 text-xl font-semibold dark:text-white">
                  Oops! No Services Available
                </h3>
                <p className="mb-6 text-lg text-gray-500 dark:text-gray-400">
                  It seems like there are no services available at the moment.
                  Please check back later!
                </p>
                <button
                  className="px-6 py-3 text-white transition-colors bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-4xl px-6 py-10 mx-auto">
          <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Reviews {reviewStats.reviewCount > 0 && `(${reviewStats.reviewCount})`}
          </h3>

          {user?.role === "student" && bookingId && (
            <form
              onSubmit={onSubmitReview}
              className="p-5 mb-6 bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700"
            >
              <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Rate your session with {mentor?.name}
              </p>
              <StarRating value={rating} onChange={setRating} interactive size="text-2xl" />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share details about your experience (optional)"
                className="w-full px-4 py-2 mt-4 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 mt-3 font-semibold text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit review"}
              </button>
            </form>
          )}

          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No reviews yet. Be the first to review this mentor!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {review.student?.name || "Student"}
                    </p>
                    <StarRating value={review.rating} size="text-sm" />
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MentorDetails;
