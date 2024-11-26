import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axiosInstance from '@/utils/axios';

import Spinner from '@/components/ui/Spinner';
import AddressLink from '@/components/ui/AddressLink';
import BookingWidget from '@/components/ui/BookingWidget';
import PlaceGallery from '@/components/ui/PlaceGallery';
import PerksWidget from '@/components/ui/PerksWidget';

const PlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (!id) {
      return '';
    }

    setLoading(true);

    const getPlace = async () => {
      try {
        const { data } = await axiosInstance.get(`/places/${id}`);
        setPlace(data.place);
        
        // Calculate the average rating
        const totalRating = data.place.reviews.reduce((acc, review) => acc + review.rating, 0);
        const avgRating = totalRating / data.place.reviews.length;
        setAverageRating(avgRating);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching place data:', error);
        setLoading(false);
      }
    };

    getPlace();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!place) {
    return null;  // or a fallback UI
  }

  return (
    <div className="mt-4 overflow-x-hidden px-8 pt-20">
      <h1 className="text-3xl">{place.title}</h1>

      <AddressLink placeAddress={place.address} />
      <PlaceGallery place={place} />

      <div className="mt-8 mb-8 grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
        <div className="">
          <div className="my-4">
            <h2 className="text-2xl font-semibold">Description</h2>
            {place.description}
          </div>
          Max number of guests: {place.maxGuests}
          <PerksWidget perks={place?.perks} /> {/* Only pass perks to PerksWidget */}
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>

      {/* Overall Rating */}
      <div className="mt-4">
        <h2 className="text-2xl font-semibold">Overall Rating</h2>
        <div className="flex items-center">
          <p className="text-yellow-500 text-xl font-semibold">{averageRating.toFixed(2)} ★</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="-mx-8 border-t bg-white px-8 py-8">
        <h2 className="mt-4 text-2xl font-semibold">Reviews</h2>
        <div className="mt-4">
          {place.reviews && place.reviews.length > 0 ? (
            place.reviews.map((review) => (
              <div key={review._id} className="mb-4">
                <p className="font-semibold">{review.reviewName}</p>
                <p className="text-yellow-500">Rating: {review.rating} ★</p>
                <p className="text-gray-600">{review.review}</p>
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>

      <div className="-mx-8 border-t bg-white px-8 py-8">
        <div>
          <h2 className="mt-4 text-2xl font-semibold">Extra Info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm leading-5 text-gray-700">
          {place.extraInfo}
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
