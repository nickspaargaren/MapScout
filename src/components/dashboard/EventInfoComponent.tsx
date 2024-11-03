import React from "react";
import './EventInfoComponent.css';
import Collapsible from 'components/collapsible';

interface EventInfoComponentProps {
  description: string;
}

const EventInfoComponent: React.FC<EventInfoComponentProps> = ({ description }) => {
  return (
      <p className="event-description">{description}</p>
  );
};

export default EventInfoComponent;
