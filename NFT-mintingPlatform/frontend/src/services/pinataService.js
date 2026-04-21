import axios from 'axios';

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export const uploadFileToIPFS = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    
    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: file.name,
    });
    data.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    data.append('pinataOptions', options);

    try {
        const res = await axios.post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                Authorization: `Bearer ${PINATA_JWT}`
            }
        });
        return res.data.IpfsHash;
    } catch (error) {
        console.error('Error uploading file to IPFS:', error);
        throw error;
    }
};

export const uploadJSONToIPFS = async (json) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    
    try {
        const res = await axios.post(url, json, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${PINATA_JWT}`
            }
        });
        return res.data.IpfsHash;
    } catch (error) {
        console.error('Error uploading JSON to IPFS:', error);
        throw error;
    }
};
