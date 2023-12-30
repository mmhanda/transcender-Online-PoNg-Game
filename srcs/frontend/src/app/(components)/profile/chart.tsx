import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, RadialLinearScale, Filler } from 'chart.js';

import { Radar } from 'react-chartjs-2';

import { FC } from 'react';
import { User } from './ProfileComp';

interface Props {
    user: User;
}

const CharRadar: FC<Props> = ({ user }) => {
    //hide Legend
    ChartJS.register(LineElement, PointElement, Tooltip, Legend, RadialLinearScale, Filler);
    ChartJS.defaults.plugins.legend.display = false;
    return (
        <div className='w-full overflow-hidden relative flex justify-center'>
            <Radar
                className='w-full '
                data={{
                    labels: ["Time", "Social", "Matches", "Raking", "Win rate"],
                    datasets: [{
                        backgroundColor: "rgba(255,255,255,0.7)",
                        data: [Math.round((user?.playerStats?.playeTime/1000/60)), user?.friendCount, user?.playerStats?.games, user?.playerStats?.rank, user?.playerStats?.winRate],
                        fill: true,
                        tension: .05,
                        pointRadius: 0,
                        pointHitRadius: 20,
                        borderJoinStyle: "round",
                        // number of grids
                    }]
                }}
                width={400}
                height={400}
                options={{
                    maintainAspectRatio: true,
                    scales: {
                        r: {
                            angleLines: {
                                color: "rgba(255,255,255,.15)",
                                display: true,
                            },
                            pointLabels: {
                                font: {
                                    size: 12,
                                },
                                color: "rgba(255,255,255,.60)",
                                padding: 1,
                            },
                            grid: {
                                color: "rgba(255,255,255,.2)",
                            },
                            ticks: {
                                count: 5,
                                display: false,
                            },
                            suggestedMin: 0,
                            suggestedMax: 100,
                        },
                    },

                    animation: {
                        duration: 2000,
                        easing: "easeOutElastic"
                    },
                    responsive: false,
                }}
            />
        </div>
    );
}

export default CharRadar;