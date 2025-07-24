import { useState } from "react";
import Navbar from "./components/Navbar";
import GuestsPage from "./pages/GuestsPage";
import SpeakersPage from "./pages/SpeakersPage";
import InvitedSpeakersPage from "./pages/InvitedSpeakersPage";
import TicketsPage from "./pages/TicketsPage";

const App = () => {
    const [activeTab, setActiveTab] = useState("guests");

    const renderPage = () => {
        switch (activeTab) {
            case "guests":
                return <GuestsPage />;
            case "speakers":
                return <SpeakersPage />;
            case "invited_speakers":
                return <InvitedSpeakersPage />;
            case "tickets":
                return <TicketsPage />;
            default:
                return <GuestsPage />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="container mx-auto px-4 py-8">{renderPage()}</div>
        </div>
    );
};

export default App;
