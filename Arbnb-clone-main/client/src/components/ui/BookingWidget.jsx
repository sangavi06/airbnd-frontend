import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import { toast } from 'react-toastify';

import { useAuth } from '../../../hooks';
import axiosInstance from '@/utils/axios';
import DatePickerWithRange from './DatePickerWithRange';

const BookingWidget = ({ place }) => {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [bookingData, setBookingData] = useState({
    noOfGuests: 1,
    name: '',
    phone: '',
  });
  const [reviewData, setReviewData] = useState({
    reviewName: '',
    rating: null,
    review: '',
  });
  const [redirect, setRedirect] = useState('');
  const { user } = useAuth();

  const { noOfGuests, name, phone } = bookingData;
  const { reviewName, rating, review } = reviewData;
  const { _id: id, price } = place;

  useEffect(() => {
    if (user) {
      setBookingData({ ...bookingData, name: user.name });
    }
  }, [user]);

  const numberOfNights =
    dateRange.from && dateRange.to
      ? differenceInDays(
          new Date(dateRange.to).setHours(0, 0, 0, 0),
          new Date(dateRange.from).setHours(0, 0, 0, 0),
        )
      : 0;

  const handleBookingData = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReviewData = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStarClick = (star) => {
    setReviewData({ ...reviewData, rating: star });
  };

  const handleBooking = async () => {
    if (!user) {
      return setRedirect(`/login`);
    }

    if (numberOfNights < 1) {
      return toast.error('Please select valid dates');
    } else if (noOfGuests < 1) {
      return toast.error("No. of guests can't be less than 1");
    } else if (noOfGuests > place.maxGuests) {
      return toast.error(`Allowed max. no. of guests: ${place.maxGuests}`);
    } else if (name.trim() === '') {
      return toast.error("Name can't be empty");
    } else if (phone.trim() === '') {
      return toast.error("Phone can't be empty");
    }

    try {
      const response = await axiosInstance.post('/bookings', {
        checkIn: dateRange.from,
        checkOut: dateRange.to,
        noOfGuests,
        name,
        phone,
        place: id,
        price: numberOfNights * price,
      });

      const bookingId = response.data.booking._id;
      setRedirect(`/account/bookings/${bookingId}`);
      toast('Congratulations! Enjoy your trip.');
    } catch (error) {
      toast.error('Something went wrong!');
      console.log('Error: ', error);
    }
  };

  const handleRatingSubmit = async () => {
    if (!user) {
      return setRedirect(`/login`);
    }

    if (!rating) {
      return toast.error('Please provide a rating.');
    }
    if (!review.trim()) {
      return toast.error('Please write a review.');
    }
    if (!reviewName.trim()) {
      return toast.error('Please provide your name for the review.');
    }
  
    try {
      // Send a single review object, not an array
      const response = await axiosInstance.post(`/places/add-review/${id}`, {
        rating: Number(rating),  // Ensure rating is a number
        review: review.trim(),
        reviewName: reviewName.trim()
      });
  
      if (response.data) {
        toast.success('Thank you for your review!');
        setReviewData({ reviewName: '', rating: null, review: '' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong while submitting your review.';
      toast.error(errorMessage);
      console.error('Review submission error:', error);
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      {/* Booking Section */}
      <div className="rounded-2xl bg-white p-4 shadow-xl">
        <div className="text-center text-xl">
          Price: <span className="font-semibold">₹{place.price}</span> / per night
        </div>
        <div className="mt-4 rounded-2xl border">
          <div className="flex w-full">
            <DatePickerWithRange setDateRange={setDateRange} />
          </div>
          <div className="border-t py-3 px-4">
            <label>Number of guests: </label>
            <input
              type="number"
              name="noOfGuests"
              placeholder={`Max. guests: ${place.maxGuests}`}
              min={1}
              max={place.maxGuests}
              value={noOfGuests}
              onChange={handleBookingData}
            />
          </div>
          <div className="border-t py-3 px-4">
            <label>Your full name: </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleBookingData}
            />
            <label>Phone number: </label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={handleBookingData}
            />
          </div>
        </div>
        <button onClick={handleBooking} className="primary mt-4">
          Book this place
          {numberOfNights > 0 && <span> ₹{numberOfNights * price}</span>}
        </button>
      </div>

      {/* Rating Section */}
      <div className="rounded-2xl bg-white p-4 shadow-xl mt-6">
        <div className="mb-4">
          <label>Rate your experience: </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleStarClick(star)}
                className={`cursor-pointer text-xl ${rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div>
          <label>Your Name (for review): </label>
          <input
            type="text"
            name="reviewName"
            value={reviewName}
            onChange={handleReviewData}
            placeholder="Enter your name"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Write a review: </label>
          <textarea
            name="review"
            value={review}
            onChange={handleReviewData}
            placeholder="Share your experience..."
            className="w-full p-2 border rounded"
          />
        </div>
        <button onClick={handleRatingSubmit} className="primary mt-4">
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default BookingWidget;