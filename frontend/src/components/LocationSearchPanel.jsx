import React from "react";

const LocationSearchPanel = ({ suggestions, setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField }) => {
    
  const handleSuggestionClick = (suggestion) => {
    if (activeField === 'pickup') {
        setPickup(suggestion.description)
    } else if (activeField === 'destination') {
        setDestination(suggestion.description)
    }
    setPanelOpen(false)
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 text-gray-500">
        Type to search locations...
      </div>
    );
  }

  return (
    <div>
      {suggestions.map((suggestion, idx) => (
        <div 
          key={suggestion.placeId || idx} 
          onClick={() => handleSuggestionClick(suggestion)} 
          className="flex gap-4 border-2 border-gray-50 hover:bg-gray-50 active:border-gray-50 p-3 rounded-xl items-center my-2 justify-start cursor-pointer"
        >
          <div className="bg-[#eee] h-8 w-12 flex items-center justify-center rounded-full">
            <i className="ri-map-pin-fill"></i>
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{suggestion.mainText}</h4>
            {suggestion.secondaryText && (
              <p className="text-sm text-gray-500">{suggestion.secondaryText}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
