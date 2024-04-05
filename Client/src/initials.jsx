const generateInitials = (firstName, lastName) => {
	const firstInitial = firstName ? firstName[0].toUpperCase() : "";
	const lastInitial = lastName ? lastName[0].toUpperCase() : "";
	return `${firstInitial}${lastInitial}`;
};

export default generateInitials;
