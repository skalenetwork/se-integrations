// components/simple-dropzone.component.js
import React from "react";

import {Card, CardContent, Table, TableCell, TableRow} from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import TableBody from "@material-ui/core/TableBody";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
    card:{
        overflowX:"scroll"
    }
}));
const ListOfNFTs = (props) => {
    let listOfNFTs = props.listOfNFTs;
    const classes = useStyles();

    if (!listOfNFTs || !listOfNFTs.length > 0) {
        return (
            <Card padding={'0'} className={classes.card}>
                <CardContent >
                    <PerfectScrollbar>
                        <div >
                        </div>
                    </PerfectScrollbar>
                </CardContent>
            </Card>
        );
    }
    else {
        return (
            <Card padding={'0'} className={classes.card}>
                <CardContent >
                    <PerfectScrollbar>
                        <div >
                            <Table>
                                <TableBody>
                                    <TableRow>
                                    {listOfNFTs.map((obj) => (
                                            <TableCell>
                                                <Card style={{ maxWidth: 200, margin: 15 }}>
                                                    <CardActionArea>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItem: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <CardMedia
                                                                style={{
                                                                    width: "auto",
                                                                    maxHeight: "200px"
                                                                }}
                                                                component="img"
                                                                image={obj['tokenURI']}
                                                            />
                                                        </div>
                                                    </CardActionArea>
                                                    <Typography>Amount: {obj["amount"]}</Typography>
                                                    <Typography>Type: {obj["type"]}</Typography>
                                                    <Typography>Used: {obj["used"]}</Typography>
                                                </Card>
                                            </TableCell>
                                    ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </PerfectScrollbar>
                </CardContent>
            </Card>
        );
    }
};

export default ListOfNFTs;
