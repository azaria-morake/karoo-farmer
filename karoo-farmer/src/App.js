import { useState } from 'react';
import styled from 'styled-components';
import { 
  FiPlus, 
  FiDroplet, 
  FiCloudRain, 
  FiEdit,
  FiSave,
  FiThermometer,
  FiSun,
  FiDatabase,
  FiInfo
} from 'react-icons/fi';

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  h1 {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
  }
`;

const InventoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ItemCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }
`;

const ReservoirList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReservoirItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f0f8ff;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e0f0ff;
  }
`;

const WaterLevel = styled.div`
  height: 20px;
  width: 120px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.level}%;
    background: ${props => props.alert ? '#ff5722' : '#2196f3'};
    transition: width 0.3s ease;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.2);
  width: 90%;
  max-width: 500px;
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  background: #f8f8f8;
  border-radius: 6px;
  margin: 0.5rem 0;

  svg {
    flex-shrink: 0;
  }
`;

function App() {
  const [inventory, setInventory] = useState([
    { 
      id: 1, 
      name: 'Tomatoes', 
      image: '/happy-tomato.jpeg',
      waterNeed: 5, 
      currentWater: 30,
      rainfallImpact: 65,
      soilMoisture: 40,
      notes: ''
    },
    { 
      id: 2, 
      name: 'Maize', 
      image: 'happy-maize2.jpeg',
      waterNeed: 8, 
      currentWater: 45,
      rainfallImpact: 80,
      soilMoisture: 60,
      notes: ''
    }
  ]);

  const [activeModal, setActiveModal] = useState(null);
  const [editing, setEditing] = useState(false);
  const [aiNote, setAiNote] = useState('');
  const [weather] = useState({ temp: 25, condition: 'Sunny' });

  const handleSaveNote = (cropId) => {
    setInventory(inventory.map(crop => 
      crop.id === cropId ? {...crop, notes: aiNote} : crop
    ));
    setAiNote('');
    setEditing(false);
  };

  return (
    <Container>
      <Header>
        <h1><FiDroplet /> KarooFarmer</h1>
      </Header>

      {/* Weather Widget */}
      <div className="weather">
        <h3><FiCloudRain /> Current Weather</h3>
        <p>{weather.condition} | {weather.temp}°C</p>
        <MetricItem>
          <FiInfo />
          <div>
            <small>AI Tip:</small>
            <p>Next week's forecast shows rain - consider reducing irrigation</p>
          </div>
        </MetricItem>
      </div>

      {/* Inventory Grid */}
      <h2>Crops</h2>
      <InventoryGrid>
        {inventory.map(crop => (
          <ItemCard key={crop.id} onClick={() => setActiveModal({ type: 'crop', data: crop })}>
            <img src={crop.image} alt={crop.name} />
            <h3>{crop.name}</h3>
            <p>{crop.waterNeed}L/day</p>
          </ItemCard>
        ))}
        <ItemCard onClick={() => setActiveModal({ type: 'crop', data: null })}>
          <FiPlus size={24} />
          Add Crop
        </ItemCard>
      </InventoryGrid>

      {/* Reservoir Display */}
      <h2>Water Reservoirs</h2>
      <ReservoirList>
        {inventory.map(crop => (
          <ReservoirItem key={crop.id} onClick={() => setActiveModal({ type: 'reservoir', data: crop })}>
            <div style={{ width: '100px' }}>{crop.name}</div>
            <WaterLevel level={(crop.currentWater / 50) * 100} alert={crop.currentWater < 20} />
            <div>{crop.currentWater}L remaining</div>
          </ReservoirItem>
        ))}
      </ReservoirList>

      {/* Modal System */}
      {activeModal && (
        <Modal>
          {activeModal.type === 'crop' ? (
            <>
              <h2>{activeModal.data?.name || 'New Crop'}</h2>
              
              {activeModal.data && (
                <>
                  <img 
                    src={activeModal.data.image} 
                    alt={activeModal.data.name} 
                    style={{ width: '100px', margin: '1rem 0' }}
                  />

                  <MetricItem>
                    <FiDroplet />
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Water Reserve</span>
                        <strong>{activeModal.data.currentWater}L</strong>
                      </div>
                      <WaterLevel level={(activeModal.data.currentWater / 50) * 100} />
                    </div>
                  </MetricItem>

                  <MetricItem>
                    <FiThermometer />
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Daily Need</span>
                        <strong>{activeModal.data.waterNeed}L/day</strong>
                      </div>
                    </div>
                  </MetricItem>
                </>
              )}

              {editing ? (
                <div style={{ marginTop: '1rem' }}>
                  <textarea
                    value={aiNote}
                    onChange={(e) => setAiNote(e.target.value)}
                    placeholder="Add notes for AI (e.g., 'Leaves wilting since Tuesday')"
                    style={{ width: '100%', minHeight: '100px', padding: '0.5rem' }}
                  />
                  <button 
                    onClick={() => handleSaveNote(activeModal.data?.id)}
                    style={{ marginTop: '0.5rem' }}
                  >
                    <FiSave /> Save Note
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setEditing(true)}
                  style={{ marginTop: '1rem' }}
                >
                  <FiEdit /> Add AI Note
                </button>
              )}
            </>
          ) : (
            /* Reservoir Modal */
            <>
              <h2>{activeModal.data.name} Water Metrics</h2>
              
              <MetricItem>
                <FiCloudRain />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Rainfall Impact</span>
                    <strong>{activeModal.data.rainfallImpact}%</strong>
                  </div>
                  <WaterLevel level={activeModal.data.rainfallImpact} />
                </div>
              </MetricItem>

              <MetricItem>
                <FiSun />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Soil Moisture</span>
                    <strong>{activeModal.data.soilMoisture}%</strong>
                  </div>
                  <WaterLevel level={activeModal.data.soilMoisture} />
                </div>
              </MetricItem>

              <MetricItem>
                <FiDatabase />
                <div>
                  <small>AI Recommendation:</small>
                  <p>Reduce watering frequency by 20% next week due to expected rainfall</p>
                </div>
              </MetricItem>
            </>
          )}

          <button 
            onClick={() => {
              setActiveModal(null);
              setEditing(false);
            }}
            style={{ marginTop: '1rem' }}
          >
            Close
          </button>
        </Modal>
      )}
    </Container>
  );
}

export default App;