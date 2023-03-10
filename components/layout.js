// add navigation bar and header

import Head from 'next/head';
import styles from './layout.module.css';
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SettingsIcon from '@mui/icons-material/Settings';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';


export const siteTitle = 'Next.js Sample Website';

export default function Layout({ children }) {
    const router = useRouter()
    const [value, setValue] = useState('/');

    const handleChange = (event, newValue) => {
        // change page with nextjs
        router.push(newValue);
        setValue(newValue);
    };

    return (
        <div className={styles.container}>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                {/* <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle,
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" /> */}
            </Head>
            <main className={styles.workoutBackground}>{children}</main>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={10}>
            <BottomNavigation showLabels sx={{ justifyContent: 'space-around' }} value={value} onChange={handleChange}>
                <BottomNavigationAction
                    label="Settings"
                    value="/settings"
                    icon={<SettingsIcon/>}
                />
                <BottomNavigationAction
                    label="Workout"
                    value="/"
                    icon={<FitnessCenterIcon />}
                />
                <BottomNavigationAction
                    label="Statistics"
                    value="/statistics"
                    icon={<AutoGraphIcon/>}
                />
            </BottomNavigation>
            </Paper>
        </div>
    );
}