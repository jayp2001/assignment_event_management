import './eventList.css';
import { useNavigate } from 'react-router-dom';

function EventList() {
    const navigate = useNavigate();
    return (
        <div className='listContainer'>
            <div className='flex justify-between'>
                <div className='tabHeader'>
                    Events
                </div>
                <div className='flex self-center gap-2'>
                    <div >
                        <button className='outlineBtn'>Download Excel</button>
                    </div>
                    <div >
                        <button className='filledBtn' onClick={() => navigate('/createEvent')}>Create New Event</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default EventList;