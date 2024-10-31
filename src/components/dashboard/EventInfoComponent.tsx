import React from "react";
import './EventInfoComponent.css'; 
import Collapsible from 'components/collapsible'; 

interface EventInfoComponentProps {
  title: string;
  description: string;
  highlight: string;
}

const EventInfoComponent: React.FC<EventInfoComponentProps> = ({ title, description, highlight }) => {
  return (
    <Collapsible label={title}> 
      <div className="event-info-container">
        <p className="event-description">{description}</p>
        <p className="event-description">{highlight}</p>
      </div>
    </Collapsible>
  );
};

export default EventInfoComponent;
