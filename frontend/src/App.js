// src/pages/CustomizePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CustomizePage = () => {
  // State management for form data
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    roomType: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    style: '',
    colorScheme: [],
    budget: '',
    furniture: []
  });
  
  // State for available options
  const [availableStyles] = useState([
    'Modern', 'Contemporary', 'Traditional', 
    'Industrial', 'Scandinavian', 'Bohemian'
  ]);
  
  const [availableColors] = useState([
    'Neutral', 'Warm', 'Cool', 'Bold', 
    'Pastel', 'Monochrome'
  ]);

  const [recommendedFurniture, setRecommendedFurniture] = useState([]);

  // Handle form input changes
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle dimension changes
  const handleDimensionChange = (e, dimension) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value
      }
    }));
  };

  // Handle color scheme selection
  const handleColorSelection = (color) => {
    setFormData(prev => ({
      ...prev,
      colorScheme: prev.colorScheme.includes(color)
        ? prev.colorScheme.filter(c => c !== color)
        : [...prev.colorScheme, color]
    }));
  };

  // Handle furniture selection
  const handleFurnitureSelection = (item) => {
    setFormData(prev => ({
      ...prev,
      furniture: [...prev.furniture, item]
    }));
  };

  // Fetch recommended furniture based on user preferences
  const fetchRecommendations = async () => {
    try {
      const response = await axios.post('/api/recommendations', formData);
      setRecommendedFurniture(response.data);
    } catch (error) {
      toast.error('Failed to fetch recommendations');
    }
  };

  // Save design
  const saveDesign = async () => {
    try {
      await axios.post('/api/designs/save', formData);
      toast.success('Design saved successfully!');
    } catch (error) {
      toast.error('Failed to save design');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/customize', formData);
      toast.success('Customization completed!');
      // Handle success (e.g., redirect to 3D view)
    } catch (error) {
      toast.error('Error processing your request');
    }
  };

  // Step content components
  const RoomTypeStep = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Select Room Type</h2>
      <select 
        value={formData.roomType}
        onChange={(e) => handleInputChange(e, 'roomType')}
        className="w-full p-2 border rounded"
      >
        <option value="">Select a room type...</option>
        <option value="living">Living Room</option>
        <option value="bedroom">Bedroom</option>
        <option value="dining">Dining Room</option>
        <option value="office">Home Office</option>
      </select>
    </div>
  );

  const DimensionsStep = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Room Dimensions</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label>Length (ft)</label>
          <input
            type="number"
            value={formData.dimensions.length}
            onChange={(e) => handleDimensionChange(e, 'length')}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Width (ft)</label>
          <input
            type="number"
            value={formData.dimensions.width}
            onChange={(e) => handleDimensionChange(e, 'width')}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Height (ft)</label>
          <input
            type="number"
            value={formData.dimensions.height}
            onChange={(e) => handleDimensionChange(e, 'height')}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );

  const StyleStep = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Select Style</h2>
      <div className="grid grid-cols-2 gap-4">
        {availableStyles.map(style => (
          <button
            key={style}
            onClick={() => handleInputChange({ target: { value: style }}, 'style')}
            className={`p-4 border rounded ${
              formData.style === style ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );

  const ColorSchemeStep = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Color Scheme</h2>
      <div className="grid grid-cols-3 gap-4">
        {availableColors.map(color => (
          <button
            key={color}
            onClick={() => handleColorSelection(color)}
            className={`p-4 border rounded ${
              formData.colorScheme.includes(color) ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  );

  // Navigation buttons
  const NavigationButtons = () => (
    <div className="flex justify-between mt-8">
      {step > 1 && (
        <button
          onClick={() => setStep(step - 1)}
          className="px-6 py-2 bg-gray-500 text-white rounded"
        >
          Previous
        </button>
      )}
      {step < 4 ? (
        <button
          onClick={() => setStep(step + 1)}
          className="px-6 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-500 text-white rounded"
        >
          Complete
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-1/4 h-2 ${
                stepNumber <= step ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {step === 1 && <RoomTypeStep />}
        {step === 2 && <DimensionsStep />}
        {step === 3 && <StyleStep />}
        {step === 4 && <ColorSchemeStep />}
        <NavigationButtons />
      </form>
    </div>
  );
};

export default CustomizePage;