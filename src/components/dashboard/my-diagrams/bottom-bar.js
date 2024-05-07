import { Input } from "@mui/material";

function BottomBar({askClaude}) {
    return (
        <Input placeholder="Explain your business process here, the more detailed your explanation, the better the result will be...." onKeyPress={(e) => {
            if (e.key === 'Enter') {
                askClaude(e.target.value);
                // e.target.value = '';
            }
        }
        } />
    );
}

export default BottomBar;