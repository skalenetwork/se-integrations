import React, {useState} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import {makeStyles} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import CircularProgress from "@material-ui/core/CircularProgress";
import {green} from '@material-ui/core/colors';
import clsx from 'clsx';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Fab from "@material-ui/core/Fab";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import CardActionArea from "@material-ui/core/CardActionArea";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from '@material-ui/lab/Alert';
import ListOfNFTs from "./components/ListOfNFTs";
import {getGraphQueryTokens,getGraphQueryTokensUsed} from "./shack15";

const shack15 = require("./shack15");
const {web3Obj,setWeb3} = require("./helper");
const Filestorage = require('@skalenetwork/filestorage.js');

const endpoint = process.env.REACT_APP_ENDPOINT;
const pk = process.env.REACT_APP_PRIVATE_KEY;

const Web3 = require('web3');

const web3Provider = new Web3.providers.HttpProvider(endpoint);
let filestorageMinter = new Filestorage(web3Provider, true);
let web3Minter = new Web3(web3Provider);

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },

    imgRoot: {
        backgroundColor: theme.palette.background.paper,
        margin: theme.spacing(2)
    },


    formControl: {
        margin: theme.spacing(1),
        minWidth: 250,
    },

    selectEmpty: {
        marginTop: theme.spacing(2),
    },wrapper: {
        margin: theme.spacing(1),
        position: 'relative'
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    icon: {
        margin: theme.spacing.unit * 2
    },
    iconHover: {
        margin: theme.spacing.unit * 2,
        "&:hover": {
            color: red[800]
        }
    },
    title: {
        color: blue[800],
        fontWeight: "bold",
        fontFamily: "Montserrat",
        align: "center"
    },
    button: {
        color: blue[900],
        margin: 10
    },
    secondaryButton: {
        color: "gray",
        margin: 10
    },
    typography: {
        margin: theme.spacing.unit * 2,
        backgroundColor: "default"
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },

    cardHeader: {
        textalign: "center",
        align: "center",
        backgroundColor: "white"
    },
    input: {
        display: "none"
    },
}));


export default function App() {

    const classes = useStyles();

    const [values, setValues] = React.useState({
        amount: '',
        id: '',
        type: '',
        address: '',
        nftName: '',
    });

    const [signer, setSigner] = React.useState(''
    );
    const [nfts, setNFTs] = React.useState([]);

    const [nftUsables, setNFTUsables] = React.useState([]);

    const [balance, setBalance] = React.useState('0');
    const [mainState, setMainState] = React.useState('initial');
    const [selectedFile, setSelectedFile] = useState()
    const [byteArray, setByteArray] = useState()
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [selectedTab, setSelectedTab] = useState(0);

    const timer = React.useRef();
    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });

    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    async function refresh(address) {
        timer.current = window.setTimeout(() => {
        }, 10000);

        let listOfNFTs = await getGraphQueryTokens(address)
        let listOfUsable = await getGraphQueryTokensUsed(address)
        console.log("refresh list of NFTs:", listOfNFTs);
        console.log("refresh list of usable NFTs:", listOfUsable);
        setNFTs(listOfNFTs.data.myShack15NFTTokens);
        setNFTUsables(listOfUsable.data.myShack15NFTTokens);
    }

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    // Function called anytime the tab changes
    function handleTabChange(event, value) {
        setSelectedTab(value);
    }

    const onClickLogin = async (e) => {
        const { torus, web3 } = web3Obj;

        e.preventDefault();
        if (!torus.isInitialized) {
            await torus
                .init({
                    network: {
                        host: endpoint, // mandatory
                        chainId: "2494235777812358", // optional
                        networkName: "Skale Network dAppNet" // optional
                    }
                })
        }
        if (!torus.isLoggedIn) {
            await torus.login();
        }
        setWeb3(torus.provider);

        let address = (await web3.eth.getAccounts())[0];
        let addressBalance = await web3.eth.getBalance(address);
        // let fileStorage = new Filestorage(web3.currentProvider,true);
        // let listOfNFTs = await fileStorage.listDirectory(web3.utils.stripHexPrefix(address));
        await refresh(address);
        setSigner(address);
        setBalance(addressBalance);

        torus.provider.on('accountsChanged', async (accounts) => {
            console.log(accounts, 'accountsChanged');
            let address = Array.isArray(accounts) && accounts[0] || ''
            let addressBalance = await web3.eth.getBalance(address);

            await refresh(address);

            setSigner(address);
            setBalance(addressBalance);
        });
    };

    const handleButtonClick = async () => {
        if (!loading) {

            setSuccess(false);
            setLoading(true);

            const {web3} = web3Obj;
            let address = (await web3.eth.getAccounts())[0];
            let addressMinter = await web3.eth.accounts.privateKeyToAccount(pk).address
            if (addressMinter === address) {
                // filestorageMinter.createDirectory(address,"MusicNFT");
                // let filestorage = new Filestorage(web3.currentProvider, true);
                // await filestorage.reserveSpace(values.address, values.address, 52428800);
                console.log("Uploading file:")
                let findDirectory = [];
                let storagePath = web3Minter.utils.stripHexPrefix(addressMinter).toLowerCase();
                let files = await filestorageMinter.listDirectory(storagePath);

                findDirectory = files.filter(function (file) {
                    return !!file.name.match(/(EbruFolder)/i);
                });

                if (findDirectory.length > 0) {
                    console.log("Directory exists");
                    console.log(findDirectory)
                } else {
                    console.log("Directory doesn't exist, Creating");
                    await filestorageMinter.createDirectory(addressMinter, 'EbruFolder', pk);
                }

                let nftStoragePath = "EbruFolder/" + values.nftName;

                let nftFiles = await filestorageMinter.listDirectory(storagePath+"/"+"EbruFolder/");

                let obj = nftFiles.find(o => o.name === values.nftName);
                if (obj) {
                    setOpen(true);
                    setLoading(false);
                    setMessage('NFT already exist in file storage, Change NFT File Name!')
                } else {
                    console.log(nftStoragePath)
                    console.log("uploading")
                    console.log(byteArray)
                    let link = await filestorageMinter.uploadFile(
                        address,
                        nftStoragePath,
                        byteArray,
                        pk
                    );
                    console.log(link);
                    setLoading(false);
                    console.log("Mint Tokens");

                    let assignedAddress = getAssignedAddress(values.address)

                    await shack15.mint(assignedAddress, values.amount, values.type, storagePath + "/" + nftStoragePath, web3);

                    // console.log(await shack15.getUri(values.address, values.type, web3));

                    timer.current = window.setTimeout(() => {
                        setSuccess(true);
                        setLoading(false);
                    }, 2000);
                }
            } else {
                setOpen(true);
                setLoading(false);
                setMessage('Address is not a minter!')
            }

        }
    };

    /*
    Just some examples mapping.
    To do for Shack15: connect users to account addresses
     */
    function getAssignedAddress(input)
    {
        if(input === "ebru@skalelabs.com")
            return "0x47F56CCeAA98417F6D2756aD84Dfc9B1d3671229";
        if(input === "john@skalelabs.com")
            return "0xcfb537de35fC8421A03B1BdCA574B11f56333c49";
        if(input === "Shack15Cafe")
        {
            return "0xb713eAfca2f6984b3e7AdBc0531b1d37403812a8";
        }
    }


    const handleButtonGrantMarketPlaceRole = async () => {
        if (!loading) {

            setSuccess(false);
            setLoading(true);
            const {web3} = web3Obj;
            let address = (await web3.eth.getAccounts())[0];
            let addressMinter = await web3.eth.accounts.privateKeyToAccount(pk).address
            if (addressMinter === address) {
                console.log( await shack15.grantMarketPlaceRole(values.addressGrant, web3));
                timer.current = window.setTimeout(() => {
                    setSuccess(true);
                    setLoading(false);
                }, 2000);
            } else {
                setOpen(true);
                setLoading(false);
                setMessage('Address is not a market place owner !')
            }
        }
    };

    function getId(memberNfts) {
        let idHere = memberNfts.at(memberNfts.length - 1).id;
        console.log(idHere)
        let id = idHere.substring(idHere.indexOf("-") + 1).trim();
        console.log("NFTCount:", id);
        return id;
    }


    const handleButtonTransferPayItForward = async () => {
        if (!loading) {

            setSuccess(false);
            setLoading(true);

            const {web3} = web3Obj;
            let address = (await web3.eth.getAccounts())[0];
            let newAssignedAddress = getAssignedAddress(values.addressTo)
            await shack15.transfer(address, newAssignedAddress, getId(nfts), values.amountTo, web3)
            await refresh(address);
            timer.current = window.setTimeout(() => {
                setSuccess(true);
                setLoading(false);
            }, 2000);
        }
    };

    const handleButtonTransferOneTime = async () => {
        if (!loading) {

            setSuccess(false);
            setLoading(true);
            const {web3} = web3Obj;
            let address = (await web3.eth.getAccounts())[0];
            console.log(address)
            let newAssignedAddress = getAssignedAddress(values.addressMarketPlace)
            console.log("Sending Transaction")
            await shack15.lock(newAssignedAddress, getId(nftUsables), web3)
            await refresh(address);
            setSuccess(true);
            setLoading(false);
            timer.current = window.setTimeout(() => {
                setSuccess(true);
                setLoading(false);
            }, 2000);
        }
    };

    function handleChangeImage(event) {
        const {files} = event.target
        let reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onload = (e) => {
            setSelectedFile(reader.result)
            setByteArray(new Uint8Array(reader.readAsArrayBuffer))
            setMainState("uploaded")
        }

        let reader2 = new FileReader()
        reader2.readAsArrayBuffer(files[0])
        reader2.onload = (e) => {
            setByteArray(new Uint8Array(reader2.result))
        }
    }

    function InitialState() {
        return (
            <CardContent>
                <Grid container justify="center" alignItems="center">
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleChangeImage}
                    />
                    <label htmlFor="contained-button-file">
                        <Fab component="span" className={classes.button}>
                            <AddPhotoAlternateIcon />
                        </Fab>
                    </label>

                </Grid>
            </CardContent>
        );
    }

    function UploadedState() {
        return (
            <React.Fragment>
                <CardActionArea onClick={imageResetHandler}>
                    <img
                        width="100%"
                        className={classes.media}
                        src={selectedFile}
                    />
                </CardActionArea>
            </React.Fragment>
        );
    }

    function UploadState() {
        if (mainState ==='initial') {
            return <InitialState />;
        }
        else {
            return <UploadedState/>;
        }
    }


    const imageResetHandler = event => {
        setMainState("initial");
        setSelectedFile(null)
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

return (

        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={selectedTab} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Mint NFT" />
                    <Tab label="MarketPlace"/>
                    <Tab label="Entrepreneur" />
                    <Tab label="Member"/>
                </Tabs>

            </AppBar>
            {selectedTab === 0 && (
                <>
                <Container maxWidth="md">
                    <Box my={4}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Typography  variant="h4" component="h1" gutterBottom>
                                    Minting Example
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="contained" color="primary" onClick={onClickLogin}>Torus Sign In</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel htmlFor="standard-basic">NFT Owner: {signer}</InputLabel>
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel htmlFor="standard-basic">Balance: {balance}</InputLabel>
                            </Grid>

                        </Grid>
                        <Container maxWidth="sm">
                            <Grid container spacing={3}>
                                <React.Fragment>
                                    <div className={classes.imgRoot}>
                                        <Card>
                                            <UploadState/>
                                        </Card>
                                    </div>
                                </React.Fragment>
                            </Grid>

                            <Grid container spacing={3}>
                                <FormControl fullWidth className={classes.formControl}>
                                    <InputLabel htmlFor="standard-basic">Mint To:</InputLabel>
                                    <Input
                                        id="standard-basic"
                                        value={values.address}
                                        onChange={handleChange('address')}
                                    />
                                </FormControl>
                                <FormControl fullWidth className={classes.formControl}>
                                    <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
                                    <Input
                                        id="standard-adornment-amount"
                                        value={values.amount}
                                        onChange={handleChange('amount')}
                                    />
                                </FormControl>
                                <FormControl fullWidth className={classes.formControl}>
                                    <InputLabel htmlFor="standard-basic">Nft Name:</InputLabel>
                                    <Input
                                        id="standard-basic"
                                        value={values.nftName}
                                        onChange={handleChange('nftName')}
                                    />
                                </FormControl>
                                <FormControl required className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-required-label">Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-required-label"
                                        id="demo-simple-select-required"
                                        value={values.type}
                                        onChange={handleChange('type')}
                                        className={classes.selectEmpty}>
                                        <MenuItem value={1}>Pay It Forward</MenuItem>
                                        <MenuItem value={2}>Usable</MenuItem>
                                    </Select>
                                    <FormHelperText>Required</FormHelperText>
                                </FormControl>


                                <Grid item xs={12}>
                                    <div className={classes.wrapper} align='center'>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={buttonClassname}
                                            disabled={loading}
                                            onClick={handleButtonClick}
                                        >
                                            Mint token
                                        </Button>
                                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                    </div>

                                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                        <Alert onClose={handleClose} severity="error">
                                            {message}
                                        </Alert>
                                    </Snackbar>
                                </Grid>
                            </Grid>
                        </Container>

                    </Box>
                </Container>
                </>
                )}
            {selectedTab === 1 && (
                <Container maxWidth="md">
                    <Box my={4}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Typography  variant="h4" component="h1" gutterBottom>
                                    Grant MarketPlace Role
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="contained" color="primary" onClick={onClickLogin}>Torus Sign In</Button>
                            </Grid>
                        </Grid>
                        <Container maxWidth="sm">
                            <Grid container spacing={3}>
                                <FormControl fullWidth className={classes.formControl}>
                                    <InputLabel htmlFor="standard-adornment-amount">Transfer To:</InputLabel>
                                    <Input
                                        id="standard-adornment-amount"
                                        value={values.addressGrant}
                                        onChange={handleChange('addressGrant')}
                                    />
                                </FormControl>
                                <Grid item xs={12}>
                                    <div className={classes.wrapper} align='center'>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={buttonClassname}
                                            disabled={loading}
                                            onClick={handleButtonGrantMarketPlaceRole}
                                        >
                                            Grant Role to MarketPlace
                                        </Button>
                                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                    </div>
                                </Grid>
                            </Grid>
                        </Container>

                    </Box>
                </Container>
            )}

            {selectedTab === 2 && (
                <Container maxWidth="md">
                    <Box my={4}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Typography  variant="h4" component="h1" gutterBottom>
                                    Pay It Forward Example
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="contained" color="primary" onClick={onClickLogin}>Torus Sign In</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel htmlFor="standard-adornment-amount">Signer: {signer}</InputLabel>
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel htmlFor="standard-adornment-amount">Balance: {balance}</InputLabel>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <ListOfNFTs listOfNFTs={nfts}/>
                            </Grid>
                        </Grid>
                        <Container maxWidth="sm">
                            <Grid container spacing={3}>
                                <FormControl fullWidth className={classes.formControl}>
                                    <InputLabel htmlFor="standard-adornment-amount">Transfer To:</InputLabel>
                                    <Input
                                        id="standard-adornment-amount"
                                        value={values.addressTo}
                                        onChange={handleChange('addressTo')}
                                    />
                                </FormControl>
                                <FormControl fullWidth className={classes.formControl}>
                                    <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
                                    <Input
                                        id="standard-adornment-amount"
                                        value={values.amountTo}
                                        onChange={handleChange('amountTo')}
                                    />
                                </FormControl>
                                <Grid item xs={12}>
                                    <div className={classes.wrapper} align='center'>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={buttonClassname}
                                            disabled={loading}
                                            onClick={handleButtonTransferPayItForward}
                                        >
                                            Transfer token
                                        </Button>
                                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                    </div>
                                </Grid>
                            </Grid>
                        </Container>

                    </Box>
                </Container>
            )}

            {selectedTab === 3 && (
                <Container maxWidth="md">
                    <Box my={4}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Typography  variant="h4" component="h1" gutterBottom>
                                    Use token in a MarketPlace
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="contained" color="primary" onClick={onClickLogin}>Torus Sign In</Button>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <ListOfNFTs listOfNFTs={nftUsables}/>
                            </Grid>
                        </Grid>
                        <Container maxWidth="sm">
                            <Grid container spacing={3}>
                                <FormControl fullWidth className={classes.formControl}>
                                    <InputLabel htmlFor="standard-adornment-amount">Current Marketplace:</InputLabel>
                                    <Input
                                        id="standard-adornment-amount"
                                        value={values.addressMarketPlace}
                                        onChange={handleChange('addressMarketPlace')}
                                    />
                                </FormControl>
                                <Grid item xs={12}>
                                    <div className={classes.wrapper} align='center'>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={buttonClassname}
                                            disabled={loading}
                                            onClick={handleButtonTransferOneTime}
                                        >
                                            Use one Shack15 token
                                        </Button>
                                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                    </div>
                                </Grid>
                            </Grid>
                        </Container>

                    </Box>
                </Container>
            )}
        </div>

    );
}
