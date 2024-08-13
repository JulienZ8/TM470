import React, { useState, useEffect } from 'react';

function SeasonSelector({ seasons, onSeasonChange, selectedSeasons }) {
    const [localSelectedSeasons, setLocalSelectedSeasons] = useState(selectedSeasons || []);

    useEffect(() => {
        onSeasonChange(localSelectedSeasons);
    }, [localSelectedSeasons, onSeasonChange]);

    const handleSeasonChange = (season) => {
        if (localSelectedSeasons.includes(season)) {
            setLocalSelectedSeasons(localSelectedSeasons.filter(s => s !== season));
        } else {
            setLocalSelectedSeasons([...localSelectedSeasons, season]);
        }
    };

    const handleSelectAll = () => {
        if (localSelectedSeasons.length === seasons.length) {
            setLocalSelectedSeasons([]);
        } else {
            setLocalSelectedSeasons(seasons);
        }
    };

    return (
        <div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={localSelectedSeasons.length === seasons.length}
                        onChange={handleSelectAll}
                    />
                    Select all
                </label>
            </div>
            {seasons.map((season, index) => (
                <div key={index}>
                    <label>
                        <input
                            type="checkbox"
                            checked={localSelectedSeasons.includes(season)}
                            onChange={() => handleSeasonChange(season)}
                        />
                        {season}
                    </label>
                </div>
            ))}
        </div>
    );
}

export default SeasonSelector;
