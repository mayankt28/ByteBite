import Profile from '../models/profile.js';


export const getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await Profile.findOne({ userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const { addresses, ...updateFields } = req.body;

    const updated = await Profile.findOneAndUpdate(
      { userId },
      { $set: updateFields },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const addAddress = async (req, res) => {
  const { userId } = req.params;

  const { label, street, city, state, zip, country, isDefault } = req.body;

  try {
    const profile = await Profile.findOne({ userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

  
    if (isDefault) {
      profile.addresses.forEach(address => (address.isDefault = false));
    }

    profile.addresses.push({ label, street, city, state, zip, country, isDefault });
    await profile.save();

    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const setDefaultAddress = async (req, res) => {
  const { userId, addressId } = req.params;

  try {
    const profile = await Profile.findOne({ userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const address = profile.addresses.id(addressId);
    if (!address) return res.status(404).json({ error: "Address not found" });

 
    profile.addresses.forEach(addr => (addr.isDefault = false));
    address.isDefault = true;

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAddress = async (req, res) => {
  const { userId, addressId } = req.params;
  const update = req.body;

  try {
    const profile = await Profile.findOne({ userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const address = profile.addresses.id(addressId);
    if (!address) return res.status(404).json({ error: "Address not found" });

    
    if (update.isDefault === true) {
      profile.addresses.forEach(addr => (addr.isDefault = false));
    }

    Object.assign(address, update);
    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  const { userId, addressId } = req.params;

  try {
    const profile = await Profile.findOne({ userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const address = profile.addresses.id(addressId);
    if (!address) return res.status(404).json({ error: "Address not found" });

  
    profile.addresses.pull({ _id: addressId });
    await profile.save();

    res.json({ message: "Address deleted successfully", profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

