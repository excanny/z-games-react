const Step2_Duration = ({ duration, setDuration, next, prev }) => { // Changed prevStep to prev
    const handleChange = (e) => {
        setDuration(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        next(); // Also change this from nextStep() to next()
    };

    return (
        <form onSubmit={handleSubmit} className="step2-duration-form">
            <h2>Step 2: Set Game Duration</h2>
            <label htmlFor="duration">
                Duration (minutes):
                <input
                    type="number"
                    id="duration"
                    name="duration"
                    min="1"
                    value={duration}
                    onChange={handleChange}
                    required
                />
            </label>
            <div className="form-navigation">
                <button type="button" onClick={prev}> {/* Changed prevStep to prev */}
                    Back
                </button>
                <button type="submit">
                    Next
                </button>
            </div>
        </form>
    );
};

export default Step2_Duration;