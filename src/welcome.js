import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from './button';
import welcomeImage from './assets/welcomeImage.jpg';

function WelcomePage() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    name: '',
    profilePicture: null,
    password: ''
  });
  const [profilePreview, setProfilePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserDetails((prevDetails) => ({ ...prevDetails, profilePicture: file }));
      setProfilePreview(URL.createObjectURL(file));  // Generate preview URL
    }
  };

  const removeProfilePicture = () => {
    setUserDetails((prevDetails) => ({ ...prevDetails, profilePicture: null }));
    setProfilePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      const userData = { ...userDetails, profilePicture: base64String };
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/home');
    };
    if (userDetails.profilePicture) {
      reader.readAsDataURL(userDetails.profilePicture);
    } else {
      localStorage.setItem('user', JSON.stringify(userDetails));
      navigate('/home');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <img src={welcomeImage} alt="Welcome" className="mb-6 w-full h-full max-h-60 sm:max-h-[75vh] rounded-lg object-cover" />
      <h1 className="text-lg sm:text-2xl">Welcome to TaskMate</h1>
      <p className="text-sm sm:text-base">Your personal task manager designed to keep you  <br></br> organized and productive. Easily create, track, and complete  <br></br>your daily tasks with just a few clicks. Stay on top of <br></br> your schedule with reminders, progress tracking, and  <br></br>task categories—all in one place.A workspace for over 10 million  <br></br> influencers around the world.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        {/* Conditionally render the file input only if no profile picture is selected */}
        {!profilePreview && (
          <div>
            <label 
              htmlFor="profilePicture" 
              className="cursor-pointer bg-pink-200 text-black p-2.5 rounded-lg w-50 pr-10">
              Choose Profile Picture
            </label>
            <input 
              id="profilePicture"
              type="file" 
              accept="image/*"
              onChange={handleProfilePictureChange} 
              className="hidden"  // Hide the default file input
            />
          </div>
        )}

        {/* Show the profile preview if a picture is selected */}
        {profilePreview && (
          <div className="relative w-20 h-20 mt-2">
            <img src={profilePreview} alt="Profile Preview" className="w-full h-full rounded-full object-cover" />
            <button 
              type="button"
              onClick={removeProfilePicture}
              className="absolute bottom-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full transform translate-y-2"
            >
              ✕
            </button>
          </div>
        )}

        <input 
          type="text" 
          name="name" 
          value={userDetails.name} 
          onChange={handleInputChange} 
          placeholder="Enter your name" 
          className="border p-2 rounded"
          required 
        />
        <input 
          type="password" 
          name="password" 
          value={userDetails.password} 
          onChange={handleInputChange} 
          placeholder="Enter a password" 
          className="border p-2 rounded"
          required 
        />

        <Button type="submit" label="Create Account" className="bg-pink-200 text-white mt-4" />
      </form>
    </div>
  );
}

export default WelcomePage;
