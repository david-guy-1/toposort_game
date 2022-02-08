#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <queue>
#include <utility>
using namespace std;

class Graph{
	public :
		vector<string> vertices;
		map<string, vector<string> > adjList; // adjList[x] is a list of vertices y such that x->y is an edge
		
		Graph(vector<string> vertices,vector<pair<string, string> > edges) : vertices(vertices){
			for(string vertex : vertices){
				adjList.insert({vertex, {} });
			}	
			for(pair<string, string> edge : edges){
				adjList.at(edge.first).push_back(edge.second);
			}	
		}
};

vector<string> toposort(Graph & g){
	// make a list of indegrees
	map<string, int> inDegree = {};
	for(string vertex : g.vertices){
		inDegree.insert({vertex, 0});
	}
	
	for(string vertex : g.vertices){
		for(string vertex2 : g.adjList.at(vertex)){
			inDegree.at(vertex2) ++; 
		}
	}
	queue<string> visit = {};
	vector<string> output = {};
	
	// get unvisited
	for(string vertex : g.vertices){
		if(inDegree.at(vertex) == 0){
			visit.push(vertex);
		}
	}
	
	// topological sort main loop
	
	while(visit.size() != 0){
		// get the next item
		string next = visit.front();
		// remove it from the to visit list
		visit.pop();
		// decrement in degrees
		for(string vertex : g.adjList.at(next)){
			inDegree.at(vertex) --;
			if(inDegree.at(vertex) == 0){
				visit.push(vertex);
			}
		}
		output.push_back(next);
	}
	return output;
	
}

int main(int argc, char * argv[]){

	Graph g = Graph({"1", "2", "3", "4", "5", "6", "x1", "x2", "x3", "7", "y1", "y2", "y3", "y4", "y5", "8", "9", "10", "11", "12", "13", "14", "15", "w1", "w2", "z"}, {{"1","2"},{"1","3"},{"2","3"},{"3","4"},{"2","5"},{"3","5"},{"x1","x2"}, {"x2","4"}, {"2","x3"}, {"x3","6"}, {"5", "6"}, {"4", "z"}, {"6","7"},{"y1","y3"},{"y2","y3"},{"y3","x3"},{"y2", "y4"},{"6", "y4"},{"y4", "y5"},{"7","10"},{"y5","10"},{"7","8"},{"y5","8"},{"y2","9"},{"10","11"}, {"9", "11"}, {"8", "12"}, {"11","12"},{"6","13"},{"4","13"},{"10","14"},{"13","15"},{"14","15"},{"w1","w2"},{"w2","9"},{"12","z"},{"15","z"}});
	for(string x : toposort(g)){
		cout << x << "\n";
	}
	return 0;
}